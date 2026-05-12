import { useSocketContext } from './SocketContext.jsx';
import { useEffect, useRef } from 'react';
import useConversation from '../statemanage/useConversation.js';
import { useAuth } from './AuthProvider.jsx';
import sound from '../assets/notification.mp3';

function useGetSocketMessage() {
    const { socket } = useSocketContext();
    const { setMessages } = useConversation();
    const { authUser } = useAuth();
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(sound);
        audioRef.current.preload = 'auto';
        audioRef.current.load();

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
                    const currentUserId = authUser?._id || authUser?.user?._id;
                    const senderId = newMessage.senderId?.toString?.() || newMessage.senderId;

                    if (audioRef.current && senderId && senderId !== currentUserId?.toString?.()) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
                    }
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
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [socket, setMessages]);
}

export default useGetSocketMessage