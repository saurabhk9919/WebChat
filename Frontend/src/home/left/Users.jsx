import React from 'react'
import User from '../User'
import GetAllUsers from '../../context/GetAllUsers.jsx';

const Users = () => {
  const [allUsers, loading] = GetAllUsers();
  console.log("All users in Users.jsx:", allUsers);
  return (
    <div className='flex-1 overflow-y-auto px-4 pb-4 space-y-3 flex-scrollbar'>
      
   {allUsers.map((user,index) => {
     return <User key={index} user={user} />;
   })}
   

</div>


  );
}

export default Users