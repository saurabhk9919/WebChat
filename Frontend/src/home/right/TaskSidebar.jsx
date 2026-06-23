import React, { useState } from "react";
import useConversation from "../../statemanage/useConversation";
import { scrollToAndHighlightMessage, slugify } from "../../utils/navigationHelper";
import axios from "axios";
import toast from "react-hot-toast";

function TaskSidebar() {
    const { tasks, setTasks, messages, setMessages, taskFilter, setTaskFilter } = useConversation();
    const [searchQuery, setSearchQuery] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);

    // Edit form states
    const [editTitle, setEditTitle] = useState("");
    const [editDueDate, setEditDueDate] = useState("");
    const [editPriority, setEditPriority] = useState("low");
    const [editAssignee, setEditAssignee] = useState("You");
    const [isSaving, setIsSaving] = useState(false);

    // Helper to find message index
    const getMessageIndex = (msgId) => {
        if (!Array.isArray(messages)) return null;
        const index = messages.findIndex((m) => m._id === msgId);
        return index !== -1 ? index + 1 : null;
    };

    const handleStatusToggle = async (task) => {
        const newStatus = task.status === "open" ? "done" : "open";
        
        // Optimistic UI update
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
        );

        try {
            await axios.patch(`/api/tasks/${task._id}`, { status: newStatus }, { withCredentials: true });
        } catch (error) {
            console.error("Error toggling task status:", error);
            toast.error("Failed to update status");
            // Rollback
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
            );
        }
    };

    const handleDelete = async (taskId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/tasks/${taskId}`, { withCredentials: true });
            
            // Update local state
            const deletedTask = tasks.find((t) => t._id === taskId);
            setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
            
            if (deletedTask?.sourceMessageId) {
                setMessages((prevMessages) =>
                    prevMessages.map((m) =>
                        m._id === deletedTask.sourceMessageId ? { ...m, linkedTaskId: null } : m
                    )
                );
            }
            toast.success("Task deleted");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const handleEditStart = (task) => {
        setEditingTaskId(task._id);
        setEditTitle(task.title);
        setEditDueDate(task.dueDate || "");
        setEditPriority(task.priority || "low");
        setEditAssignee(task.assignee || "You");
    };

    const handleEditSave = async (e, taskId) => {
        e.preventDefault();
        if (!editTitle.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.patch(
                `/api/tasks/${taskId}`,
                {
                    title: editTitle,
                    dueDate: editDueDate,
                    priority: editPriority,
                    assignee: editAssignee
                },
                { withCredentials: true }
            );

            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === taskId ? response.data : t))
            );
            setEditingTaskId(null);
            toast.success("Task updated");
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        } finally {
            setIsSaving(false);
        }
    };

    // Filters and Search
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            taskFilter === "all" ||
            (taskFilter === "open" && task.status === "open") ||
            (taskFilter === "done" && task.status === "done");
        return matchesSearch && matchesStatus;
    });

    const totalTasks = tasks.length;

    const priorityBadges = {
        low: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        high: "border-rose-500/20 bg-rose-500/10 text-rose-400"
    };

    return (
        <div className="w-80 flex flex-col h-full bg-slate-950/70 border-l border-white/10 text-white select-none">
            {/* Header section */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Tasks
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                            {totalTasks}
                        </span>
                    </h3>
                </div>
            </div>

            {/* Filters section */}
            <div className="p-3 border-b border-white/5 space-y-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full text-xs rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                />

                <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-white/5">
                    {["all", "open", "done"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setTaskFilter(status)}
                            className={`py-1 text-[10px] font-semibold rounded-md capitalize transition ${
                                taskFilter === status
                                    ? "bg-slate-800 text-white shadow-sm border border-white/5"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List section */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => {
                        const isEditing = editingTaskId === task._id;
                        const msgIdx = getMessageIndex(task.sourceMessageId);

                        return (
                            <div
                                key={task._id}
                                id={`sidebar-task-${task._id}`}
                                className="group relative rounded-xl border border-white/5 bg-slate-900/30 p-3 hover:bg-slate-900/60 hover:border-white/10 transition-all duration-300"
                            >
                                {isEditing ? (
                                    <form onSubmit={(e) => handleEditSave(e, task._id)} className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Task Title"
                                                className="w-full rounded-md border border-white/15 bg-slate-950 px-2.5 py-1 text-xs text-white focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                            <div>
                                                <label className="block text-slate-400 mb-0.5">Due Date</label>
                                                <input
                                                    type="text"
                                                    value={editDueDate}
                                                    onChange={(e) => setEditDueDate(e.target.value)}
                                                    placeholder="Tomorrow 7 PM"
                                                    className="w-full rounded-md border border-white/10 bg-slate-950 px-2 py-0.5 text-white focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 mb-0.5">Assignee</label>
                                                <input
                                                    type="text"
                                                    value={editAssignee}
                                                    onChange={(e) => setEditAssignee(e.target.value)}
                                                    placeholder="Assignee"
                                                    className="w-full rounded-md border border-white/10 bg-slate-950 px-2 py-0.5 text-white focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <select
                                                value={editPriority}
                                                onChange={(e) => setEditPriority(e.target.value)}
                                                className="rounded-md border border-white/10 bg-slate-950 px-1.5 py-0.5 text-[10px] text-white focus:outline-none"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                            <div className="flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingTaskId(null)}
                                                    className="rounded-md bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[10px] text-slate-300"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSaving}
                                                    className="rounded-md bg-blue-600 hover:bg-blue-500 px-2.5 py-1 text-[10px] font-medium text-white disabled:opacity-50"
                                                >
                                                    {isSaving ? "Saving" : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2.5 pr-8">
                                            <input
                                                type="checkbox"
                                                checked={task.status === "done"}
                                                onChange={() => handleStatusToggle(task)}
                                                className="checkbox checkbox-emerald checkbox-xs mt-0.5 rounded border-slate-600 focus:ring-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span
                                                    className={`text-xs font-semibold leading-normal break-words cursor-pointer block ${
                                                        task.status === "done"
                                                            ? "line-through text-slate-500"
                                                            : "text-slate-200"
                                                    }`}
                                                    onClick={() => handleEditStart(task)}
                                                >
                                                    {task.title}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400">
                                            {task.dueDate && (
                                                <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-white/5 flex items-center gap-0.5">
                                                    📅 {task.dueDate}
                                                </span>
                                            )}
                                            <span className={`px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${
                                                priorityBadges[task.priority] || "border-slate-700 bg-slate-700/10 text-slate-400"
                                            }`}>
                                                {task.priority}
                                            </span>
                                            {task.assignee && (
                                                <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 text-slate-300">
                                                    👤 {task.assignee}
                                                </span>
                                            )}
                                            {msgIdx && (
                                                <button
                                                    onClick={() => scrollToAndHighlightMessage(task.sourceMessageId)}
                                                    className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                                                >
                                                    from message #{msgIdx}
                                                </button>
                                            )}
                                        </div>

                                        {/* Hover Controls */}
                                        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditStart(task)}
                                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                                title="Edit task"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 transition"
                                                title="Delete task"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="h-64 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-900/10">
                        <span className="text-xl mb-1.5">📋</span>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                            No tasks found
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1 max-w-[180px]">
                            AI-detected task triggers will list here once created.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskSidebar;
