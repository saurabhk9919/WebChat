import React from "react";

function ActionCard({ action }) {
  if (!action || action.intent === "NONE") {
    return null;
  }

  const priorityColor = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  return (
    <div className="mt-3 rounded-xl border border-blue-500/30 bg-slate-900 p-4 shadow-lg">

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤖</span>
        <h3 className="font-semibold text-blue-400">
          AI Action Detected
        </h3>
      </div>

      <div className="space-y-2 text-sm">

        <div>
          <span className="font-semibold text-slate-300">
            Type:
          </span>{" "}
          <span className="text-white">
            {action.intent.replaceAll("_", " ")}
          </span>
        </div>

        <div>
          <span className="font-semibold text-slate-300">
            Title:
          </span>{" "}
          <span className="text-white">
            {action.title || "-"}
          </span>
        </div>

        {action.description && (
          <div>
            <span className="font-semibold text-slate-300">
              Description:
            </span>{" "}
            <span className="text-white">
              {action.description}
            </span>
          </div>
        )}

        {action.date && (
          <div>
            <span className="font-semibold text-slate-300">
              📅 Date:
            </span>{" "}
            <span className="text-white">
              {action.date}
            </span>
          </div>
        )}

        {action.time && (
          <div>
            <span className="font-semibold text-slate-300">
              ⏰ Time:
            </span>{" "}
            <span className="text-white">
              {action.time}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">

          <span className="font-semibold text-slate-300">
            Priority:
          </span>

          <span
            className={`px-2 py-1 rounded-full text-xs text-white ${
              priorityColor[action.priority] || "bg-gray-500"
            }`}
          >
            {action.priority}
          </span>

        </div>

      </div>

      <div className="flex gap-3 mt-5">

        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
        >
          Create Task
        </button>

        <button
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white transition"
        >
          Dismiss
        </button>

      </div>

    </div>
  );
}

export default ActionCard;