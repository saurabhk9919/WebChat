import React, { useState } from "react";
import useConversation from "../statemanage/useConversation";
import { scrollToAndHighlightMessage, scrollToAndHighlightSidebarTask, slugify } from "../utils/navigationHelper";
import axios from "axios";
import toast from "react-hot-toast";

function TaskCard({ taskId, messageIndex }) {
    const { tasks, setTasks, setMessages, setTaskFilter } = useConversation();
    const task = tasks.find((t) => t._id === taskId);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task?.title || "");
    const [editDueDate, setEditDueDate] = useState(task?.dueDate || "");
    const [editPriority, setEditPriority] = useState(task?.priority || "low");
    const [editAssignee, setEditAssignee] = useState(task?.assignee || "You");
    const [isSaving, setIsSaving] = useState(false);

    if (!task) {
        // If task is not in tasks list (still loading or deleted)
        return (
            <div className="mt-3 rounded-xl border border-dashed border-white/10 bg-slate-900/60 p-4 text-xs text-slate-500 flex items-center justify-between">
                <span>Task reference not found or was deleted.</span>
            </div>
        );
    }

    const priorityColors = {
        low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        high: "border-rose-500/30 bg-rose-500/10 text-rose-400"
    };

    const handleStatusToggle = async () => {
        const newStatus = task.status === "open" ? "done" : "open";
        
        // Optimistic UI update
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
        );

        try {
            await axios.patch(`/api/tasks/${task._id}`, { status: newStatus }, { withCredentials: true });
        } catch (error) {
            console.error("Error toggling task status:", error);
            toast.error("Failed to update task status");
            // Rollback
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
            );
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!editTitle.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.patch(
                `/api/tasks/${task._id}`,
                {
                    title: editTitle,
                    dueDate: editDueDate,
                    priority: editPriority,
                    assignee: editAssignee
                },
                { withCredentials: true }
            );

            // Update Zustand tasks state
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === task._id ? response.data : t))
            );
            setIsEditing(false);
            toast.success("Task updated");
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-slate-950/40 p-4 shadow-lg backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-sm">✓</span>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        Added to Tasks
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-slate-900 text-slate-400 select-all">
                        task/{slugify(task.title)}
                    </span>
                    <button
                        onClick={() => scrollToAndHighlightMessage(task.sourceMessageId)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer transition"
                    >
                        from message #{messageIndex}
                    </button>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-3">
                    <div>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Task title"
                            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <label className="block text-slate-400 mb-1">Due Date</label>
                            <input
                                type="text"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                placeholder="Tomorrow 7 PM"
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1">Assignee</label>
                            <input
                                type="text"
                                value={editAssignee}
                                onChange={(e) => setEditAssignee(e.target.value)}
                                placeholder="Assignee"
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white focus:outline-none"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditTitle(task.title);
                                    setEditDueDate(task.dueDate);
                                    setEditPriority(task.priority);
                                    setEditAssignee(task.assignee);
                                }}
                                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs text-slate-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1 text-xs font-medium text-white transition disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={task.status === "done"}
                            onChange={handleStatusToggle}
                            className="checkbox checkbox-emerald checkbox-xs mt-1 rounded border-slate-600"
                        />
                        <div className="flex-1 min-w-0">
                            <h4
                                className={`text-sm font-medium break-words leading-snug transition-all duration-300 ${
                                    task.status === "done" ? "line-through text-slate-500" : "text-slate-100"
                                }`}
                            >
                                {task.title}
                            </h4>
                            {task.description && (
                                <p className="text-xs text-slate-400 mt-1 break-words leading-relaxed">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {task.dueDate && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/5 bg-white/5 text-slate-300">
                                📅 {task.dueDate}
                            </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${
                            priorityColors[task.priority] || "border-slate-500 bg-slate-500/10 text-slate-400"
                        }`}>
                            {task.priority}
                        </span>
                        {task.assignee && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/5 bg-slate-900 text-slate-300">
                                👤 {task.assignee}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/5 mt-2 justify-end">
                        <button
                            onClick={() => {
                                if (setTaskFilter) {
                                    setTaskFilter("all");
                                }
                                setTimeout(() => {
                                    scrollToAndHighlightSidebarTask(task._id);
                                }, 60);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-[11px] font-medium text-slate-300 px-3 py-1 rounded-lg border border-white/10 transition"
                        >
                            Open
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-[11px] font-medium text-slate-300 px-3 py-1 rounded-lg border border-white/10 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleStatusToggle}
                            className={`text-[11px] font-medium px-3 py-1 rounded-lg transition border ${
                                task.status === "done"
                                    ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/10"
                                    : "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/20"
                            }`}
                        >
                            {task.status === "done" ? "Mark Open" : "Complete"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskCard;
