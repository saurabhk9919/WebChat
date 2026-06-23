import { useSocketContext } from './SocketContext.jsx';
import { useEffect, useRef } from 'react';
import useConversation from '../statemanage/useConversation.js';
import { useAuth } from './AuthProvider.jsx';
import sound from '../assets/notification.mp3';

function useGetSocketMessage() {
    const { socket } = useSocketContext();
    const { setMessages, setTasks } = useConversation();
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

        const handleTaskCreated = (newTask) => {
            try {
                if (!newTask) return;
                setTasks((prevTasks) => {
                    const tasksList = Array.isArray(prevTasks) ? prevTasks : [];
                    if (tasksList.some((t) => t._id === newTask._id)) return tasksList;
                    return [newTask, ...tasksList];
                });
                setMessages((prevMessages) => {
                    const messagesList = Array.isArray(prevMessages) ? prevMessages : [];
                    return messagesList.map((msg) => {
                        if (msg._id === newTask.sourceMessageId) {
                            return { ...msg, linkedTaskId: newTask._id };
                        }
                        return msg;
                    });
                });
            } catch (err) {
                console.error("Error handling socket taskCreated:", err);
            }
        };

        const handleTaskUpdated = (updatedTask) => {
            try {
                if (!updatedTask) return;
                setTasks((prevTasks) => {
                    const tasksList = Array.isArray(prevTasks) ? prevTasks : [];
                    return tasksList.map((t) => (t._id === updatedTask._id ? updatedTask : t));
                });
            } catch (err) {
                console.error("Error handling socket taskUpdated:", err);
            }
        };

        const handleTaskDeleted = ({ taskId, sourceMessageId }) => {
            try {
                if (!taskId) return;
                setTasks((prevTasks) => {
                    const tasksList = Array.isArray(prevTasks) ? prevTasks : [];
                    return tasksList.filter((t) => t._id !== taskId);
                });
                setMessages((prevMessages) => {
                    const messagesList = Array.isArray(prevMessages) ? prevMessages : [];
                    return messagesList.map((msg) => {
                        if (msg._id === sourceMessageId) {
                            return { ...msg, linkedTaskId: null };
                        }
                        return msg;
                    });
                });
            } catch (err) {
                console.error("Error handling socket taskDeleted:", err);
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("taskCreated", handleTaskCreated);
        socket.on("taskUpdated", handleTaskUpdated);
        socket.on("taskDeleted", handleTaskDeleted);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("taskCreated", handleTaskCreated);
            socket.off("taskUpdated", handleTaskUpdated);
            socket.off("taskDeleted", handleTaskDeleted);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [socket, setMessages, setTasks, authUser]);
}

export default useGetSocketMessage