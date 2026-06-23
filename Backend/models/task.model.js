import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
  dueDate: {
    type: String, // Can hold dates or conversational relative strings like "Tomorrow 7 PM"
    default: ""
  },
  status: {
    type: String,
    enum: ["open", "done"],
    default: "open"
  },
  assignee: {
    type: String,
    default: "You"
  },
  sourceMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversation", // Matches name in conversation.model.js
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;
