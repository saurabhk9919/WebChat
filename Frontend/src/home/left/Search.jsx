import React from 'react'
import { IoSearch } from 'react-icons/io5'

const Search = () => {
  return (
    <div className='p-4'>
      <form action="">
        <div className='flex space-x-3'>
        <label className="input input-bordered flex items-center gap-2 rounded-full px-3 py-2">
      <input type="text" className="grow" placeholder="Search" />
        </label>
        <button><IoSearch className='text-5xl p-2 hover:bg-gray-600 rounded-full'/></button>
        </div>
      </form>
    </div>
  )
}

export default Search