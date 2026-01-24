import React from 'react'
import { useEffect } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';

function GetAllUsers() {
    const [allUsers, setAllUsers] = React.useState([]);
    const [loading, setLoading] = React.useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = Cookies.get("jwt");
                const response = await axios.get("http://localhost:5002/api/users/getUserprofile",{
                    withCredentials: true,
                    headers:{ 
                        Authorization: `Bearer ${token}` 
                    },
                });
                setAllUsers(response.data);
                setLoading(false);
            }
            catch (error) {
                console.error("Error fetching users:" + error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    return[allUsers, loading];
}

export default GetAllUsers