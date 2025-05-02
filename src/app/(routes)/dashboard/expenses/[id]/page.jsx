'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../../utils/dbConfig';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { budgets, expenses } from '@/db/schema';
import BudgetHeaderExpenses from '../_components/BudgetHeaderExpenses';
import AddExpense from '../_components/AddExpense';
import { useParams } from 'next/navigation';

function ExpensesModule() {
  const { user } = useUser();
  const { id } = useParams();

  const [budgetInfo, setBudgetInfo] = useState();

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]); // Script runs only when `user` is available

  const getBudgetInfo = async () => {

    const result = await db.select({
        ...getTableColumns(budgets),
        totalSpend: sql`sum(${expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${expenses.id})`.mapWith(Number),
      })
      .from(budgets)
      .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
      .where(eq(budgets.createdBy, user?.id))
      .where(eq(budgets.id, id)) // Use resolved params here
      .groupBy(budgets.id);

      setBudgetInfo(result[0])
  };

  return (
    <>
    <div>
      <h2 className="text-xl p-5 font-semibold">{user?.firstName}'s Expenses</h2>
    </div>
    {budgetInfo ? ( // Render only when budgetInfo is available
      <BudgetHeaderExpenses budget={budgetInfo} />
    ) : (
      <div className="p-5">Loading...</div> // Show a loading state
    )}
    <div className="grid grid-cols-1">
      <AddExpense  budgetId={id} user={user} refreshData={() => getBudgetInfo()}/>
    </div>
  </>
  );
}

export default ExpensesModule;