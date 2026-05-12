/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthProvider.jsx";

const socketContext = createContext();

export const useSocketContext = () => {
    return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { authUser } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        
        const userId = authUser?._id || authUser?.user?._id;

        if (!userId) {
            setSocket((prev) => {
                if (prev) prev.close();
                return null;
            });
            setOnlineUsers([]);
            return;
        }

        const socketInstance = io(
            import.meta.env.VITE_API_URL || "http://localhost:5002",
            {
                query: { userId },
                withCredentials: true,
                transports: ["websocket", "polling"],
            }
        );

        setSocket(socketInstance);

        socketInstance.on("getonlineusers", (users) => {
            setOnlineUsers(users || []);
        });

        return () => {
            socketInstance.close();
        };
    }, [authUser]);

    return (
        <socketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </socketContext.Provider>
    );
};