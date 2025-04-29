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
    .where(eq(budgets.createdBy,user?.firstName))
    .groupBy(budgets.id);

      setBudgetList(result);
      console.log(result)
  }

  return (
    <>
      <div className="flex flex-wrap gap-5 p-5">
          {budgetList.map((budget, index) => (
            <BudgetItem key={budget.id} budget={budget} index={index} />
          ))}
      </div>
      <div className="flex justify-center">
        <CreateBudget />
      </div>
    </>
  )
}

export default BudgetList