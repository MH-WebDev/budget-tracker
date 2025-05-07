'use client'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../../utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { budgets, expenses } from '@/db/schema'
import { useUser } from '@clerk/nextjs'

import BudgetItem from './BudgetItem'
import CreateBudget from './CreateBudget'

function BudgetList() {

  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user&&getBudgetsList()
  },[user])
  // FETCHES BUDGETS FROM DB






  const getBudgetsList = async () => {
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
          {budgetList?.length > 0 ? budgetList.map((budget, index) => (
            <BudgetItem key={budget.id} budget={budget} index={index} refreshData={() => getBudgetsList()}/>
          )) : [1,2,3,4,5].map((item, index) => (
            <div key={index} className="w-full bg-gray-100 rounded-lg h-[200px] animate-pulse">
            </div>
          ))}
           <CreateBudget refreshData={() => getBudgetsList()}/> {/*Refreshes page after creating a new budget */}
      </div>
    </>
  )
}

export default BudgetList