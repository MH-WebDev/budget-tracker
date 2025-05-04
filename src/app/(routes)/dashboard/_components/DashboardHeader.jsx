import { UserButton, useUser } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {

  const {user} = useUser();

  return (
    <div className="p-5 bg-purple-700 text-white font-semibold shadow-md
    ">
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-lg py-1">{user ? `${user.firstName}'s Dashboard` : 'Loading...'}</h1>
            <UserButton/>
        </div>
    </div>
  )
}

export default DashboardHeader