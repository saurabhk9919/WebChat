import React,{ createContext ,useState} from 'react'
import { useContext } from 'react';
import Cookies from 'js-cookie';


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => //children compentents to  use other components
{
    const initialUserState = Cookies.get("jwt") || localStorage.getItem("userInfo");
     const [authUser, setAuthUser] = React.useState(initialUserState ? JSON.parse(initialUserState) : undefined );
  return (
    <AuthContext.Provider value={{authUser, setAuthUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=> React.useContext(AuthContext);