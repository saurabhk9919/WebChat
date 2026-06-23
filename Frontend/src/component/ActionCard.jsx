import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useConversation from "../statemanage/useConversation.js";

function ActionCard({ action, messageId, messageIndex }) {
    const { setTasks, setMessages } = useConversation();
    const [isCreating, setIsCreating] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    if (!action || action.intent === "NONE" || isDismissed) {
        return null;
    }

    const priorityColors = {
        low: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        high: "border-rose-500/20 bg-rose-500/10 text-rose-400"
    };

    const formatDueDate = () => {
        const parts = [];
        if (action.date) parts.push(action.date);
        if (action.time) parts.push(action.time);
        return parts.join(" ").trim();
    };

    const handleCreateTask = async () => {
        setIsCreating(true);
        try {
            const dueDate = formatDueDate();
            const response = await axios.post(
                "/api/tasks",
                {
                    title: action.title || "New Task",
                    description: action.description || "",
                    priority: action.priority || "low",
                    dueDate: dueDate,
                    assignee: action.assignee || "You",
                    sourceMessageId: messageId
                },
                { withCredentials: true }
            );

            // Update Zustand tasks state
            setTasks((prevTasks) => {
                const tasksList = Array.isArray(prevTasks) ? prevTasks : [];
                if (tasksList.some((t) => t._id === response.data._id)) return tasksList;
                return [response.data, ...tasksList];
            });

            // Update Zustand message linkedTaskId to trigger the transition to TaskCard
            setMessages((prevMessages) => {
                const messagesList = Array.isArray(prevMessages) ? prevMessages : [];
                return messagesList.map((msg) => {
                    if (msg._id === messageId) {
                        return { ...msg, linkedTaskId: response.data._id };
                    }
                    return msg;
                });
            });

            toast.success("Task created successfully!");
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDismiss = async () => {
        try {
            // Dismiss persistently in DB
            await axios.patch(`/api/messages/dismiss/${messageId}`, {}, { withCredentials: true });
            
            // Update local state to hide it
            setIsDismissed(true);
            
            // Update messages list in state to sync
            setMessages((prevMessages) => {
                const messagesList = Array.isArray(prevMessages) ? prevMessages : [];
                return messagesList.map((msg) => {
                    if (msg._id === messageId) {
                        return {
                            ...msg,
                            detectedAction: { ...msg.detectedAction, intent: "NONE" }
                        };
                    }
                    return msg;
                });
            });
            
            toast.success("Action dismissed");
        } catch (error) {
            console.error("Error dismissing action:", error);
            // Fallback: hide locally anyway
            setIsDismissed(true);
        }
    };

    return (
        <div className="mt-3 max-w-[550px] rounded-xl border border-emerald-500/30 bg-slate-900/90 p-4 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-emerald-400 text-sm">⚙</span>
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    AI detected an action
                </h3>
            </div>

            <div className="space-y-3">
                <h4 className="text-base font-semibold text-slate-100 leading-snug">
                    {action.title || "Untitled Action"}
                </h4>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {(action.date || action.time) && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-950 border border-white/5 text-slate-300">
                            📅 {formatDueDate()}
                        </span>
                    )}

                    {action.priority && (
                        <span className={`px-2 py-1 rounded border text-[10px] font-semibold uppercase tracking-wider ${
                            priorityColors[action.priority] || "border-slate-500 bg-slate-500/10 text-slate-400"
                        }`}>
                            {action.priority} priority
                        </span>
                    )}

                    {action.assignee && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-white/5 text-slate-300">
                            👤 {action.assignee}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-white/5">
                <button
                    onClick={handleCreateTask}
                    disabled={isCreating}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-1.5 rounded-lg text-xs font-medium text-white transition shadow-md shadow-emerald-950/20"
                >
                    {isCreating ? "Creating..." : "Create Task"}
                </button>

                <button
                    onClick={handleDismiss}
                    className="bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 transition"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
}

export default ActionCard;