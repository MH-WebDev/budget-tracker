"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useDatabase } from "@/context/DatabaseContext";
import ExpensesByBudgetCard from "../_components/ExpensesByBudgetCard";
import CreateExpense from "../_components/CreateExpense";
import ExpensesTable from "../_components/ExpensesTable";
import Loading from "@/app/_components/Loading";

export default function ExpensesById() {
  const { user } = useUser(); // Get the logged-in user
  const { id } = useParams(); // Get the budget ID from the URL
  const { fetchBudgetExpenseDataById, userData, addExpense } = useDatabase(); // Access the fetch function from DatabaseContext

  const [budgetInfo, setBudgetInfo] = useState(null); // State for budget details
  const [expensesInfo, setExpensesInfo] = useState([]); // State for expenses
  //const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch budget and expenses when the component mounts or when the user changes
  useEffect(() => {
    if (user) {
      fetchAllData(); // Fetch all required data
    }
  }, [userData, user]);
  
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
  
    try {  
      // Fetch budget and expenses
      const data = await fetchBudgetExpenseDataById(
        id,
        userData[0]?.selected_date_format || "MM/dd/yyyy");
      if (data) {
        setBudgetInfo(data.budgets); // Set budget details
        setExpensesInfo(data.expenses); // Set expenses
      } else {
        setError("Failed to fetch budget data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

   // Function to handle adding a new expense
   const handleAddExpense = async (expense) => {
    try {
      const newExpense = await addExpense(expense);
      if (newExpense) {
        console.log("Expense added successfully:", newExpense);
        fetchAllData(); // Refresh data after adding an expense
      } else {
        console.error("Failed to add expense.");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
    if (loading) {
      return <Loading />
    }

    return (
    <>
      <div>
        <h2 className="text-xl p-5 font-semibold">Expenses Sheet</h2>
      </div>
      <div className="grid grid-cols-2 p-5 gap-5">
         {budgetInfo ? ( // Render only when budgetInfo is available
           <ExpensesByBudgetCard budget={budgetInfo} user={userData} />
        ) : (
          <div className="p-5">Loading...</div> // Show a loading state
        )}
         <CreateExpense
          user={userData}
          budgetId={id}
          onExpenseCreated={fetchAllData} // Calls function to add expense to database then refresh function to re-fetch data/
          />
      </div>
      <div className="p-5">
          <ExpensesTable
          budget={budgetInfo}
          expenses={expensesInfo}
          user={userData}
          refreshData={fetchAllData} // Pass the function to refresh the list
        /> 
      </div>
    </>
  );
}

