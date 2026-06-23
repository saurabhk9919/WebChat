import { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";

function useGetTasks() {
    const [loading, setLoading] = useState(false);
    const { tasks, setTasks, selectedConversation } = useConversation();

    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedConversation?._id) {
                setTasks([]);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`/api/tasks/conversation/${selectedConversation._id}`, {
                    withCredentials: true
                });
                setTasks(response.data || []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedConversation, setTasks]);

    return { loading, tasks };
}

export default useGetTasks;
