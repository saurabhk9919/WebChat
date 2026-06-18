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
    <div className='border-b border-white/10 px-5 py-4'>
      <form onSubmit={handleSubmit}>
        <div className='flex gap-3'>
          <label className="input input-bordered flex h-12 flex-1 items-center gap-2 rounded-2xl border-white/10 bg-slate-900/80 px-4 text-sm text-white shadow-inner shadow-black/20 focus-within:border-blue-500/60">
            <input
              type="text"
              className="grow bg-transparent outline-none placeholder:text-slate-500"
              placeholder={loading ? "Loading users..." : "Search by name or email"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button type="submit" aria-label="search">
            <IoSearch className='rounded-2xl p-3 text-4xl text-slate-300 transition hover:bg-slate-800 hover:text-white' />
          </button>
        </div>
      </form>

      {/* Live matches list */}
      {matches.length > 0 && (
        <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-lg shadow-black/20">
          {matches.map((user) => (
            <button key={user._id} type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-800"
                 onClick={() => { setSelectedConversation(user); setSearch(''); setMatches([]); }}>
              <div>
                <div className='font-semibold text-slate-100'>{user.name}</div>
                <div className='text-sm text-slate-400'>{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search