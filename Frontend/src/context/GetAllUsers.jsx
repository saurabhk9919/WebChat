import React from 'react'
import { useEffect } from 'react'
import axios from 'axios';
import { useAuth } from './AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';

function GetAllUsers() {
    const { setAuthUser } = useAuth();
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/users/getUserprofile",{
                    withCredentials: true,
                });
                setAllUsers(response.data);
                setLoading(false);
            }
            catch (error) {
                console.error("Error fetching users:" + error);
                if (error?.response?.status === 401) {
                    localStorage.removeItem("userInfo");
                    setAuthUser(undefined);
                    navigate('/login');
                }
                setLoading(false);
            }
        };
        fetchUsers();
    }, [navigate, setAuthUser]);
    return[allUsers, loading];
}

export default GetAllUsers