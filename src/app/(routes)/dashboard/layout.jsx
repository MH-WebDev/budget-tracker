"use client"
import React, { useEffect } from 'react';
import { DatabaseProvider, useDatabase } from '@/context/DatabaseContext';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardHeader from './_components/DashboardHeader';
import SideNav from './_components/SideNav';

function DashboardLayout({children}) {
    const {user} = useUser();
    const router = useRouter();
    const { userData, loading, fetchUserData } = useDatabase(); // HOOK TO CHECKIFUSERBUDGETS

     useEffect(()=> {
         user&&checkIfUserBudgets();
       }, [user, loading, userData])

       const checkIfUserBudgets = () => {
        const userBudgets = userData.filter((budget) => budget.createdBy === user.id);

        if (userBudgets.length === 0) {
         console.log('No budgets, redirecting');
         router.replace('/dashboard/budgets');
        }
       }

  return (
    <div className="flex flex-row"> 
      <div>{/*fixed md:w-54 hidden md:block*/}
          <SideNav />
      </div>
      <div className="w-full">{/*md:ml-54*/}
          <DashboardHeader />
          {children}
      </div>
    </div>
  )
}

export default DashboardLayout