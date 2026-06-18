import React from 'react'
import User from './User.jsx'
import GetAllUsers from '../../context/GetAllUsers.jsx';

const Users = () => {
  const [allUsers, loading] = GetAllUsers();
  console.log("All users in Users.jsx:", allUsers);

  if (loading) {
    return <div className='flex-1 px-5 py-4 text-slate-300'>Loading users...</div>;
  }

  return (
    <div className='flex-1 space-y-2 overflow-y-auto px-3 py-3'>
      {allUsers.map((user, index) => (
        <User key={user._id || index} user={user} />
      ))}
    </div>
  );
}

export default Users