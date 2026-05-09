import React from 'react'
import User from './User.jsx'
import GetAllUsers from '../../context/GetAllUsers.jsx';

const Users = () => {
  const [allUsers, loading] = GetAllUsers();
  console.log("All users in Users.jsx:", allUsers);

  if (loading) {
    return <div className='p-4 text-slate-300'>Loading users...</div>;
  }

  return (
    <div className='flex-1 overflow-y-auto px-4 pb-4 space-y-3 flex-scrollbar'>
      {allUsers.map((user, index) => (
        <User key={user._id || index} user={user} />
      ))}
    </div>
  );
}

export default Users