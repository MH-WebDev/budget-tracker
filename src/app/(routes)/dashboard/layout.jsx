'use client'
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '../../../../utils/dbConfig'
import { budgets } from '@/db/schema.jsx'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

function DashboardLayout({children}) {

  const {user} = useUser();
  const router = useRouter();

  useEffect(()=> {
    user&&checkIfUserBudgets();
  }, [user])

  const checkIfUserBudgets = async () => {
    const result = await db.select().from(budgets).where(eq(budgets.createdBy,user?.id)); //budgets.createdBy,user?.primaryEmailAddress?.emailAddress

    //console.log(result);
    if(result?.length === 0) {
      router.replace('/dashboard/budgets')
    }
  }

  return (
    <div>
        <div className="fixed md:w-64 hidden md:block">
            <SideNav />
        </div>
        <div className="md:ml-64">
          <DashboardHeader />
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout