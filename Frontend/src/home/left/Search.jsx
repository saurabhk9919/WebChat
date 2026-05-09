import React from 'react'
import { IoSearch } from 'react-icons/io5'
import GetAllUsers from '../../context/GetAllUsers.jsx'
import useConversation from '../../statemanage/useConversation.js'
import toast from 'react-hot-toast'

const Search = () => {
  const [search, setSearch] = React.useState("");
  const [allUsers, loading] = GetAllUsers();
  const { setSelectedConversation } = useConversation();
  const [matches, setMatches] = React.useState([]);

  React.useEffect(() => {
    if (!search) {
      setMatches([]);
      return;
    }
    const s = search.trim().toLowerCase();
    const found = (Array.isArray(allUsers) ? allUsers : []).filter((user) => {
      return (user?.name || "").toLowerCase().includes(s) || (user?.email || "").toLowerCase().includes(s);
    });
    setMatches(found);
  }, [search, allUsers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (!Array.isArray(allUsers) || allUsers.length === 0) {
      toast.error('Users not loaded yet');
      return;
    }

    if (matches.length === 0) {
      toast.error('User not found');
      return;
    }

    // If multiple matches, pick the first exact-ish match, otherwise first in list
    const exact = matches.find(u => (u?.name || '').toLowerCase() === search.trim().toLowerCase());
    const conversation = exact || matches[0];
    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
      setMatches([]);
    } else {
      toast.error('User not found');
    }
  }

  return (
    <div className='p-4'>
      <form onSubmit={handleSubmit}>
        <div className='flex space-x-3'>
          <label className="input input-bordered flex items-center gap-2 rounded-full px-3 py-2 w-full">
            <input
              type="text"
              className="grow bg-transparent outline-none"
              placeholder={loading ? "Loading users..." : "Search by name or email"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button type="submit" aria-label="search">
            <IoSearch className='text-2xl p-2 hover:bg-gray-600 rounded-full' />
          </button>
        </div>
      </form>

      {/* Live matches list */}
      {matches.length > 0 && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
          {matches.map((user) => (
            <div key={user._id} className="p-2 hover:bg-slate-700 rounded flex justify-between items-center cursor-pointer"
                 onClick={() => { setSelectedConversation(user); setSearch(''); setMatches([]); }}>
              <div>
                <div className='font-semibold'>{user.name}</div>
                <div className='text-sm text-slate-400'>{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search