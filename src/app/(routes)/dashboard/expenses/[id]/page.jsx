'use client';
import React, { useEffect } from 'react';
import { db } from '../../../../../../utils/dbConfig';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { budgets, expenses } from '@/db/schema';

function ExpensesModule({ params }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]); // Script runs only when `user` is available

  const getBudgetInfo = async () => {
    const resolvedParams = await params; // Await params before using it
    console.log('Params ID:', resolvedParams.id, typeof resolvedParams.id);

    const result = await db
      .select({
        ...getTableColumns(budgets),
        totalSpend: sql`sum(${expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${expenses.id})`.mapWith(Number),
      })
      .from(budgets)
      .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
      .where(eq(budgets.createdBy, user?.id))
      .where(eq(budgets.id, resolvedParams.id)) // Use resolved params here
      .groupBy(budgets.id);

  };

  return (
    <>
      <div>
        <h2 className="text-xl p-5 font-semibold">*firstName*'s Expenses</h2>
      </div>
      <div>
        
      </div>
    </>
  );
}

export default ExpensesModule;