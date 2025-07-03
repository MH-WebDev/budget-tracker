"use client"
import React, { useEffect } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardHeader from './_components/DashboardHeader';
import SideNav from './_components/SideNav';

export default function DashboardLayout({children}) {
    const {user} = useUser();
    const router = useRouter();
    const { budgets, loadingBudgets, fetchBudgetExpenseData } = useDatabase(); // HOOK TO CHECKIFUSERBUDGETS

    // Check if the user has created budgets and forward to budget page if not.
   useEffect(() => {
     if (user && !loadingBudgets && Array.isArray(budgets)) {
       checkIfUserBudgets();
     }
   }, [user, loadingBudgets, budgets]);

   const checkIfUserBudgets = () => {
     if (Array.isArray(budgets) && budgets.length === 0) {
       console.log("No budgets, redirecting...");
       router.replace("/dashboard/budgets");
     }
   };

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

