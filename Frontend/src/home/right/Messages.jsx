import { useEffect, useRef } from 'react'
import Message from './Message.jsx'
import useGetMessage from '../../context/useGetMessage.jsx'
import Loading from '../../component/Loading.jsx';
import useGetSocketMessage from '../../context/useGetSocketMessage.jsx';
import useConversation from '../../statemanage/useConversation.js';
import { scrollToAndHighlightMessage } from '../../utils/navigationHelper.js';

function Messages() {
  const {loading, messages}=useGetMessage();
  const lastMessageRef = useRef(null);
  const { pendingNavigation, setPendingNavigation, setPendingScrollMessageId } = useConversation();
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1]?._id : null;
  const prevLastMessageIdRef = useRef(null);

  useGetSocketMessage();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (pendingNavigation?.messageId) {
      const targetId = pendingNavigation.messageId;
      const element = document.getElementById(`message-${targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setPendingScrollMessageId(targetId);
        setPendingNavigation(null);
        prevLastMessageIdRef.current = lastMessageId;
      }
    } else {
      if (lastMessageId && lastMessageId !== prevLastMessageIdRef.current) {
        try {
          if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (error) {
          console.error('Error scrolling to last message:', error);
        }
        prevLastMessageIdRef.current = lastMessageId;
      }
    }
  }, [messages, pendingNavigation, setPendingNavigation, setPendingScrollMessageId, lastMessageId, loading]);

  if (loading) {
    return (
      <div className='flex-1 min-h-0 overflow-y-auto px-5 py-4'>
        <Loading />
      </div>
    );
  }

  const messageArray = Array.isArray(messages) ? messages : [];

  return (
    <div className='flex-1 min-h-0 overflow-y-auto px-5 py-4' style={{scrollBehavior: "smooth"}}>
      {messageArray.length > 0 ? (
        <div className='space-y-3'>
        {messageArray.map((message, index) => {
          const isLast = index === messageArray.length - 1;
          return (
            <div
              key={message?._id || index}
              id={`message-${message?._id}`}
              ref={isLast ? lastMessageRef : null}
              className="flex flex-col transition-all duration-300 rounded-xl"
            >
              {message && <Message message={message} messageIndex={index + 1} />}
            </div>
          );
        })}
        </div>
      ) : (
        <div className='flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center font-medium text-slate-400'>
          Say hi to your new friend. Start the conversation now.
        </div>
      )}
    </div>
  )
}

export default Messages