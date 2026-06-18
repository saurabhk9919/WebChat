import React from 'react'

function Loading() {
  return (<>
    <div className="flex w-full items-center justify-center py-10">
      <div className="flex w-56 flex-col gap-4">
        <div className="skeleton h-32 w-full rounded-2xl"></div>
        <div className="skeleton h-4 w-28 rounded-full"></div>
        <div className="skeleton h-4 w-full rounded-full"></div>
        <div className="skeleton h-4 w-full rounded-full"></div>
      </div>
    </div>
  </>
  )
}

export default Loading