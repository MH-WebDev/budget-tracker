'use client'
import React, {useState, useEffect} from 'react'
import Header from '../../_components/Header'
import { UserButton, useUser } from '@clerk/nextjs'
import InfoCard from './_components/InfoCard'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { budgets, expenses } from '@/db/schema'
import { db } from '../../../../utils/dbConfig'

function Dashboard() {
  const { user } = useUser()
  //const [loading, setLoading] = useState(true)
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [budgetTotal, setBudgetTotal] = useState(0);
  //const [getTotalSpend, setTotalSpend] = useState(0);

  useEffect(() => {
    if (user && user.id) {
      getBudgetList();
      fetchBudgetTotal();
      getExpensesList();
    }

  }, [user])

  const fetchBudgetTotal = async () => {
    const result = await db
      .select({
        totalBudget: sql`sum(${budgets.amount})`.mapWith(Number),
      })
      .from(budgets)
      .where(eq(budgets.createdBy, user?.id));

    setBudgetTotal(result[0]?.totalBudget || 0);
  };

  const getBudgetList = async () => {
        const result = await db
        .select({
          ...getTableColumns(budgets),
          totalSpend: sql `sum(${expenses.amount})`.mapWith(Number),
          totalItems: sql `count(${expenses.id})`.mapWith(Number),
        })
        .from(budgets)
        .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
        .where(eq(budgets.createdBy, user?.id)) //filter by user id, returning only results created by the current user
        .groupBy(budgets.id)
        .orderBy(desc(budgets.id));

        setBudgetList(result);
    }

   const getExpensesList = async () => {
     const result = await db
     .select({
       ...getTableColumns(expenses),
       totalSpend: sql `sum(${expenses.amount})`.mapWith(Number),
       //totalItems: sql `count(${expenses.id})`.mapWith(Number)
      })
     .from(expenses)
     .where(eq(expenses.createdBy, user?.id))
     .groupBy(expenses.id)
     .orderBy(desc(expenses.createdAt));

     setExpensesList(result);
   }
  console.log("input:", expensesList)
  return (
    <div className="p-5">
      <div>
        <h2 className="font-semibold">Welcome back, {user ? `${user.firstName}` : 'Loading...'}</h2>
      </div>
      <div>
        <InfoCard 
          budgetList={budgetList} 
          expensesList={expensesList} 
          dateFormat={user?.publicMetadata?.selectedDateFormat || "YYYY-MM-DD"}
          totalBudget={budgetTotal} 
          user={user}/>
      </div>
    </div>
  )
}

export default Dashboard