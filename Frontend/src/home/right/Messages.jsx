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
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        <Loading />
      </div>
    );
  }

  const messageArray = Array.isArray(messages) ? messages : [];

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-2' style={{scrollBehavior: "smooth"}}>
      {messageArray.length > 0 ? (
        messageArray.map((message, index) => {
          const isLast = index === messageArray.length - 1;
          return (
            <div key={message?._id || index} ref={isLast ? lastMessageRef : null}>
              {message && <Message message={message} />}
            </div>
          );
        })
      ) : (
        <div className='flex justify-center items-center h-full font-semibold text-gray-500'>
          Say hi to your new friend! Start the conversation now.
        </div>
      )}
    </div>
  )
}

export default Messages