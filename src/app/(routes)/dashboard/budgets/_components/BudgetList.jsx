'use client'
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '../../../../../../utils/dbConfig'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { budgets, expenses } from '@/db/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user&&getBudgetsList()
  },[user])
  // FETCHES BUDGETS FROM DB

  const getBudgetsList = async () => {
    const result = await db.select({
      ...getTableColumns(budgets),
      totalSpend: sql `sum(${expenses.amount})`.mapWith(Number),
      totalItems: sql `count(${expenses.id})`.mapWith(Number)
    })
    .from(budgets)
    .leftJoin(expenses,eq(budgets.id,expenses.budgetId))
    .where(eq(budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .groupBy(budgets.id);

      setBudgetList(result);
      console.log(result)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
          {budgetList?.length > 0 ? budgetList.map((budget, index) => (
            <BudgetItem key={budget.id} budget={budget} index={index} />
          )) : [1,2,3].map((item, index) => (
            <div key={index} className="w-full bg-gray-100 rounded-lg h-40 animate-pulse">
            </div>
          ))}
          <CreateBudget refreshData={() => getBudgetsList()}/>
      </div>
      <div className="flex justify-center">
        
      </div>
    </>
  )
}

export default BudgetList