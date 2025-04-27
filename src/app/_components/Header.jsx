'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { KeyRound } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'


function Header() {
  const {user,isSignedIn} = useUser();
  return (
    <div className="p-5 bg-purple-700 text-white flex flex-row justify-end items-center shadow-md">
      {isSignedIn?
        <UserButton/> :
        <Link href={'/sign-in'}>
          <Button className="cursor-pointer">
            <KeyRound /> Login / Sign Up
          </Button>
        </Link>
      }
    </div>
  )
}

export default Header