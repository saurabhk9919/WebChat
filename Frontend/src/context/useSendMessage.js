import { useState } from 'react'
import useConversation from '../statemanage/useConversation.js';
import axios from 'axios';

function useSendMessage() {
    const [loading, setLoading] = useState(false);
    const { setMessages, selectedConversation } = useConversation();

    const sendMessages = async (message) => {
        if (!selectedConversation || !selectedConversation._id) {
            console.error('No conversation selected');
            return null;
        }

        setLoading(true);
        try {
            const response = await axios.post(`/api/messages/send/${selectedConversation._id}`, {
                message,
            }, {
                withCredentials: true
            });

            if (!response.data) {
                console.error('No response data');
                return null;
            }

            const createdMessage = response.data?.newMessage;
const detectedAction = response.data?.detectedAction;

if (createdMessage) {

    const messageWithAction = {

        ...createdMessage,

        detectedAction

    };

    setMessages((prev)=>{

        if(!Array.isArray(prev)){

            return [messageWithAction];

        }

        return [...prev,messageWithAction];

    });

    return messageWithAction;
}

            return null;
        }
        catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
            throw error; // Re-throw to let caller handle it
        }
        finally {
            setLoading(false);
        }
    };

    return { loading, sendMessages };
}

export default useSendMessage