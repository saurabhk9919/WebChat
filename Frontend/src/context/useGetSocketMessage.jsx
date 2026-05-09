import { useSocketContext } from './SocketContext.jsx';
import { useEffect } from 'react';
import useConversation from '../statemanage/useConversation.js';
import sound from '../assets/notification.mp3';

function useGetSocketMessage() {
    const { socket } = useSocketContext();
    const { messages, setMessages } = useConversation();

    useEffect(() => {
        if (!socket) {
            console.log('Socket not available yet');
            return;
        }

        const handleNewMessage = (newMessage) => {
            try {
                if (!newMessage) {
                    console.error('Received empty message');
                    return;
                }

                console.log('Received new message:', newMessage);

                // Validate message has required fields
                if (!newMessage.senderId || !newMessage.message) {
                    console.error('Message missing required fields:', newMessage);
                    return;
                }

                // Play notification sound
                try {
                    const notification = new Audio(sound);
                    notification.play().catch(err => console.log('Audio play failed:', err));
                } catch (audioError) {
                    console.log('Could not play notification:', audioError);
                }

                // Update messages state
                setMessages((prevMessages) => {
                    if (!Array.isArray(prevMessages)) {
                        return [newMessage];
                    }
                    return [...prevMessages, newMessage];
                });
            } catch (error) {
                console.error('Error handling new message:', error);
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, setMessages]);
}

export default useGetSocketMessage