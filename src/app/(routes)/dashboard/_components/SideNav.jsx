'use client'
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs'
import { Banknote, BanknoteArrowDown, BanknoteArrowUp, CalendarClock, HandCoins, LayoutGrid, LogOut, PiggyBank, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import SettingsModal from './SettingsModal';

function SideNav() {
    const menuLinks = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: Banknote,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            name: 'Income',
            icon: BanknoteArrowUp,
            path: '/dashboard/income'
        },
        {
            id: 4,
            name: 'Expenses',
            icon: BanknoteArrowDown,
            path: '/dashboard/expenses'
        },
        {
            id: 5,
            name: 'Debts',
            icon: HandCoins,
            path: '/dashboard/debts'
        },
        {
            id: 6,
            name: 'Upcoming',
            icon: CalendarClock,
            path: '/dashboard/upcoming'
        },
        {
            id: 7,
            name: 'Goals',
            icon: PiggyBank,
            path: '/dashboard/goals'
        }
    ]
    const currentLinkHighlight = usePathname();

    useEffect(() => {
        console.log(currentLinkHighlight)
    }, [currentLinkHighlight])

  return (
    <div className="h-screen p-5 border-r shadow-md bg-gray-100 font-semibold">Logo Here!
        <div className="pt-10 flex flex-col gap-1">
            {menuLinks.map((menu, index)=>(
                <Link key={index} href={menu.path}>
                    <h2 className={`flex flex-row gap-5 
                        items-center py-2 cursor-pointer hover:text-purple-500 
                        ${currentLinkHighlight === menu.path && "text-purple-700"}
                        `}>
                        <menu.icon/>
                        {menu.name}
                    </h2>
                </Link>
            ))}
            <SettingsModal />
        </div>
        <div className="fixed bottom-0 flex flex-row gap-5 items-center py-5 cursor-pointer hover:text-purple-500">
            <UserButton /> Profile
        </div>
    </div>
  )
}

export default SideNav