/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import Cookies from 'js-cookie';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => //children compentents to  use other components
{
    const getUserFromStorage = () => {
        try {
            const userInfo = localStorage.getItem("userInfo");
            return userInfo ? JSON.parse(userInfo) : undefined;
        } catch (error) {
            console.error("Error parsing userInfo from storage:", error);
            return undefined;
        }
    };
    const [authUser, setAuthUser] = useState(getUserFromStorage());
  return (
    <AuthContext.Provider value={{authUser, setAuthUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=> useContext(AuthContext);