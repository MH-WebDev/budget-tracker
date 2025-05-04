"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { budgets, expenses } from "@/db/schema";
import BudgetHeaderExpenses from "../_components/BudgetHeaderExpenses";
import AddExpense from "../_components/AddExpense";
import { useParams } from "next/navigation";
import ExpensesTable from "../_components/ExpensesTable";

function ExpensesModule() {
  const { user } = useUser();
  const { id } = useParams();

  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]); // Script runs only when `user` is available

  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(budgets),
        totalSpend: sql`sum(${expenses.amount})`.mapWith(Number),
        totalItems: sql`count(${expenses.id})`.mapWith(Number),
      })
      .from(budgets)
      .leftJoin(expenses, eq(budgets.id, expenses.budgetId))
      .where(eq(budgets.createdBy, user?.id))
      .where(eq(budgets.id, id)) // Use resolved params here
      .groupBy(budgets.id);

    setBudgetInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(expenses)
      .where(eq(expenses.budgetId, id))
      .orderBy(desc(expenses.createdAt));

    setExpensesList(result);
  };

  return (
    <>
      <div>
        <h2 className="text-xl p-5 font-semibold">Expenses Sheet</h2>
      </div>
      <div className="grid grid-cols-2 p-5 gap-5">
        {budgetInfo ? ( // Render only when budgetInfo is available
          <BudgetHeaderExpenses budget={budgetInfo} />
        ) : (
          <div className="p-5">Loading...</div> // Show a loading state
        )}
        <AddExpense
          budgetId={id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="p-5">
        <ExpensesTable
          expensesList={expensesList}
          dateFormat={user?.publicMetadata?.selectedDateFormat || "YYYY-MM-DD"}
        />
      </div>
    </>
  );
}

export default ExpensesModule;
