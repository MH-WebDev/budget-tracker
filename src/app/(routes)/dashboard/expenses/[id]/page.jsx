"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
//import AddExpense from "../_components/AddExpense";
import { useParams } from "next/navigation";
//import ExpensesTable from "../_components/ExpensesTable";
import { useDatabase } from '@/context/DatabaseContext';
import ExpensesByBudgetCard from "../_components/ExpensesByBudgetCard";

export default function ExpensesById() {
  const { user } = useUser();
  const { id } = useParams();
  const { getBudgetById, userData } = useDatabase();

  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (user) {
      fetchBudgetInfo();
    }
  }, [user]); // Script runs only when `user` is available

  const fetchBudgetInfo = async () => {
    const budget = await getBudgetById(id);
    setBudgetInfo(budget);
    fetchExpensesList()
  };

  const fetchExpensesList = async () => {
    console.log("Coming soon")
  };
  console.log("Page User Data:", userData)
    return (
    <>
      <div>
        <h2 className="text-xl p-5 font-semibold">Expenses Sheet</h2>
      </div>
      <div className="grid grid-cols-2 p-5 gap-5">
         {budgetInfo ? ( // Render only when budgetInfo is available
           <ExpensesByBudgetCard budget={budgetInfo} user={userData[0]} />
        ) : (
          <div className="p-5">Loading...</div> // Show a loading state
        )}
         {/* <AddExpense
          budgetId={id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />  */}
      </div>
      <div className="p-5">
         {/* <ExpensesTable
          expensesList={expensesList}
          dateFormat={user?.publicMetadata?.selectedDateFormat || "YYYY-MM-DD"} // CONVERT TO DATABASE INTEGRATION
          getExpensesList={fetchBudgetInfo} // Pass the function to refresh the list
        />  */}
      </div>
    </>
  );
}

