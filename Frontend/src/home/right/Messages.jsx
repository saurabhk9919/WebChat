import { useEffect, useRef } from 'react'
import Message from './Message.jsx'
import useGetMessage from '../../context/useGetMessage.jsx'
import Loading from '../../component/Loading.jsx';
import useGetSocketMessage from '../../context/useGetSocketMessage.jsx';

function Messages() {
  const {loading, messages}=useGetMessage();
  const lastMessageRef = useRef(null);

  useGetSocketMessage();
  console.log("Messages in Messages.jsx:", messages);

  useEffect(() => {
    try {
      if (lastMessageRef.current && Array.isArray(messages) && messages.length > 0) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error scrolling to last message:', error);
    }
  }, [messages]);

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
            <div key={message?._id || index} ref={isLast ? lastMessageRef : null} className='flex'>
              {message && <Message message={message} />}
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