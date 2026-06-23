import Task from "../models/task.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { io, getRecieverSocketId } from "../SocketIO/server.js";

// Helper to notify participants of a task event
const notifyParticipants = async (conversationId, eventName, payload) => {
    try {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            conversation.participants.forEach((pId) => {
                const socketId = getRecieverSocketId(pId.toString());
                if (socketId) {
                    io.to(socketId).emit(eventName, payload);
                }
            });
        }
    } catch (err) {
        console.error("Error in notifyParticipants socket emit:", err);
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignee, sourceMessageId } = req.body;
        const createdBy = req.user._id;

        if (!title || !sourceMessageId) {
            return res.status(400).json({ message: "Title and sourceMessageId are required" });
        }

        // Find the source message to resolve conversation details
        const msg = await Message.findById(sourceMessageId);
        if (!msg) {
            return res.status(404).json({ message: "Source message not found" });
        }

        // Find conversation containing these participants
        let conversation = await Conversation.findOne({
            participants: { $all: [msg.senderId, msg.recieverId] }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found for this message" });
        }

        // Create the task
        const task = new Task({
            title,
            description: description || "",
            priority: priority || "low",
            dueDate: dueDate || "",
            status: "open",
            assignee: assignee || "You",
            sourceMessageId,
            conversationId: conversation._id,
            createdBy
        });

        await task.save();

        // Update the source message's linkedTaskId
        msg.linkedTaskId = task._id;
        await msg.save();

        // Notify participants in real-time
        await notifyParticipants(conversation._id, "taskCreated", task);

        return res.status(201).json(task);
    } catch (error) {
        console.error("Error in createTask:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTasksByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const senderId = req.user._id;

        // Try finding by direct ID, or by participants if a user ID is supplied
        let conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, conversationId] }
            });
        }

        if (!conversation) {
            return res.status(200).json([]);
        }

        const tasks = await Task.find({ conversationId: conversation._id }).sort({ createdAt: -1 });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error("Error in getTasksByConversation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Apply changes
        const allowedUpdates = ["title", "description", "priority", "dueDate", "status", "assignee"];
        allowedUpdates.forEach((field) => {
            if (updates[field] !== undefined) {
                task[field] = updates[field];
            }
        });

        await task.save();

        // Notify participants in real-time
        await notifyParticipants(task.conversationId, "taskUpdated", task);

        return res.status(200).json(task);
    } catch (error) {
        console.error("Error in updateTask:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const { conversationId, sourceMessageId } = task;

        // Delete the task
        await Task.findByIdAndDelete(id);

        // Clear reference on the message
        await Message.findByIdAndUpdate(sourceMessageId, { linkedTaskId: null });

        // Notify participants in real-time
        await notifyParticipants(conversationId, "taskDeleted", {
            taskId: id,
            sourceMessageId
        });

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error in deleteTask:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
