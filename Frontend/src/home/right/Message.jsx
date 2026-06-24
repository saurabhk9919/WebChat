import React from 'react'
import ActionCard from "../../component/ActionCard";
import TaskCard from "../../component/TaskCard";
import useConversation from "../../statemanage/useConversation.js";

function Message({ message, messageIndex }) {
  if (!message) {
    return null;
  }

  try {
    const authUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!authUser || !authUser._id) {
      console.error('No auth user found');
      return null;
    }

    const { pendingScrollMessageId, setPendingScrollMessageId } = useConversation();
    const isHighlighted = message._id === pendingScrollMessageId;

    const itsme = message.senderId === authUser._id;
    const chatName = itsme ? "chat-end" : "chat-start";
    const chatColor = itsme ? "bg-green-500 text-white" : "chat-bubble-neutral";
    
    const createdAt = message.createdAt ? new Date(message.createdAt) : new Date();
    const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    const bubbleClass = itsme
      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md'
      : 'bg-slate-800 text-slate-100 rounded-bl-md border border-white/10';
    
    const highlightClass = isHighlighted ? 'highlight-message' : '';
    
   return (
    <>
      <div className={`chat ${chatName} max-w-[85%]`}>
        <div
          className={`chat-bubble whitespace-pre-wrap break-words px-4 py-3 ${bubbleClass} ${highlightClass}`}
          onAnimationEnd={() => {
            if (isHighlighted) {
              setPendingScrollMessageId(null);
            }
          }}
        >
          <span className="block">
            {message.message || "Message"}
          </span>
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {formattedTime}
        </div>
      </div>

      {message.linkedTaskId ? (
        <TaskCard taskId={message.linkedTaskId} messageIndex={messageIndex} />
      ) : (
        message.detectedAction &&
        message.detectedAction.intent !== "NONE" && (
          <ActionCard
            action={message.detectedAction}
            messageId={message._id}
            messageIndex={messageIndex}
          />
        )
      )}
    </>
  );
  } catch (error) {
    console.error('Error rendering message:', error);
    return null;
  }
}

export default Message