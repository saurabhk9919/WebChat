import React from 'react'

function Chatuser() {
  return (
    <>
    <div className='w-full h-[10vh] flex items-center gap-4 bg-slate-900 px-5 py-4 rounded-lg hover:bg-slate-700 duration-300 cursor-pointer'>

        <div>
             <div className="avatar avatar-online">
  <div className="w-16 rounded-full">
    <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
  </div>
</div>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-bold text-lg leading-tight'>Saurabh Kashyap</h1>
            <span className='text-sm text-slate-300'>Online</span>
        </div>
    </div>
   </>
  )
}

export default Chatuser