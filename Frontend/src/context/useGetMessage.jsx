import { useEffect, useState } from 'react';
import useConversation from '../statemanage/useConversation.js';
import axios from 'axios';

function useGetMessage() {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation?._id) {
                setMessages([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`/api/messages/get/${selectedConversation._id}`, {
                    withCredentials: true
                });
                setMessages(response.data?.messages || []);
            } catch (error) {
                console.log('Error fetching messages:', error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedConversation, setMessages]);

    return { loading, messages };
}

export default useGetMessage;