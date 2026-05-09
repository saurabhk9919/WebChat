import React from 'react'
import useConversation from '../statemanage/useConversation.js';
import { useEffect } from 'react';
import axios from 'axios';

function useUserGetMessage() {
    const [loading, setLoading] = React.useState(false);
    const { selectedConversation, messages, setMessages } = useConversation();

  useEffect(() => {
    const fetchMessages = async () => {
        if (!selectedConversation || !selectedConversation._id) {
            setMessages([]);
            return;
        }
        setLoading(true);
        try{
            const response= await axios.get(`/api/messages/get/${selectedConversation._id}`);
            setMessages(response.data.messages || []);
        }
        catch(error){
            console.error("Error fetching messages:", error);
            setMessages([]);
        }
        finally {
            setLoading(false);
        }
    };
    fetchMessages();
  },[selectedConversation, setMessages]);
    return { loading, messages};
}

export default useUserGetMessage