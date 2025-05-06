'use client'
import React, {useState, useEffect} from 'react'
import Header from '../../_components/Header'
import { UserButton, useUser } from '@clerk/nextjs'
import InfoCard from './_components/InfoCard'
import { desc, eq, sql } from 'drizzle-orm'
import { budgets } from '@/db/schema'
import { db } from '../../../../utils/dbConfig'

function Dashboard() {
  const { user } = useUser()
  const [budgetList, setBudgetList] = useState([]);

  const getBudgetInfo = async () => {
        const result = await db
        .select({
          ...getTableColumns(budgets),
          totalSpend: sql `sum(${expenses.amount})`.mapWith(Number),
          totalItems: sql `count(${expenses.id})`.mapWith(Number)
        })
        .from(budgets)
        .leftJoin(expenses,eq(budgets.id,expenses.budgetId))
        .where(eq(budgets.createdBy, user?.id))
        .groupBy(budgets.id)
        .orderBy(desc(budgets.id));

        setBudgetList(result);
    }

  return (
    <div className="p-5">
      <div>
        <h2 className="font-semibold">Welcome back, {user ? `${user.firstName}` : 'Loading...'}</h2>
      </div>
      <div>
        <InfoCard budgetList={budgetList}/>
      </div>
    </div>
  )
}

export default Dashboard