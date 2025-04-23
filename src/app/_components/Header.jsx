import React from 'react'
import { Button } from '@/components/ui/button'
import { KeyRound } from 'lucide-react'


function Header() {
  return (
    <div className="p-5 bg-purple-700 text-white flex flex-row justify-end items-center shadow-md">
      <Button>
        <KeyRound />Login / Sign Up
      </Button>
    </div>
  )
}

export default Header