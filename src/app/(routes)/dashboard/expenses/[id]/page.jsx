"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useDatabase } from "@/context/DatabaseContext";
import ExpensesByBudgetCard from "../_components/ExpensesByBudgetCard";
import CreateExpense from "../_components/CreateExpense";
import ExpensesTable from "../_components/ExpensesTable";
import Loading from "@/app/_components/Loading";
import FilterComponent from "../../_components/FilterComponent";
import { selectExpenseOptions } from "@/app/_components/Categories";

export default function ExpensesById() {
  const { user } = useUser(); // Get the logged-in user
  const { id } = useParams(); // Get the budget ID from the URL
  const { fetchBudgetExpenseDataById, userData, addExpense } = useDatabase(); // Access the fetch function from DatabaseContext

  const [budgetInfo, setBudgetInfo] = useState(null); // State for budget details
  const [expensesInfo, setExpensesInfo] = useState([]); // State for expenses
  //const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [daysFilter, setDaysFilter] = useState(0); // Default time filter to last 30 days
  const allCategoryValues = selectExpenseOptions.filter(opt => opt.value !== "All").map(opt => opt.value);
  const [selectedCategories, setSelectedCategories] = useState(allCategoryValues);
  const userCurrencySymbol = userData?.preferred_currency_symbol || " ";

  // Fetch budget and expenses when the component mounts or when the user changes
  useEffect(() => {
    if (user) {
      fetchAllData(); // Fetch all required data
    }
  }, [userData, user]);
  // BEGIN DATA FETCHING FUNCTION
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch budget and expenses
      const data = await fetchBudgetExpenseDataById(
        id,
        userData?.selected_date_format || "MM/dd/yyyy"
      );
      if (data) {
        setBudgetInfo(data.budgets); // Set budget details
        setExpensesInfo(data.expenses); // Set expenses
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  //END DATA FETCHING FUNCTION
  // ------------------------------------
  // Function to handle adding a new expense
  const handleAddExpense = async (expense) => {
    try {
      const newExpense = await addExpense(expense);
      if (newExpense) {
        fetchAllData(); // Refresh data after adding an expense
      } else {
        console.error("Failed to add expense.");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
  if (loading) {
    return <Loading />;
  }
  // ------------------------------------
  // BEGIN DATA FILTERING LOGIC
  // Filter expenses based on selected categories and by the selected time period
  const now = new Date();


  const filteredExpenses = expensesInfo.filter(exp => { // Array output of filter function
    // Category filter

  if (selectedCategories.length === 0) return false;
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(exp.category);

    // Date filter
    if (daysFilter === 0) {
      // "All" selected, include all dates
      return categoryMatch;
    } else {
      const expDate = new Date(exp.updated_at || exp.date || exp.created_at);
      const daysDifference = (now - expDate) / (1000 * 60 * 60 * 24);
      return categoryMatch && daysDifference <= daysFilter;
    }
  });
  return (
    <>
      <div>
        <h2 className="text-xl p-5 font-semibold">Expenses Sheet</h2>
      </div>
      
      <div className="grid grid-cols-2 p-5 gap-5">
        <ExpensesByBudgetCard budget={budgetInfo} userData={userData} />
        <CreateExpense
          userData={userData}
          budgetId={id}
          onExpenseCreated={fetchAllData} // Calls function to add expense to database then refresh function to re-fetch data/
        />
      </div>
      <FilterComponent
        daysFilter={daysFilter}
        setDaysFilter={setDaysFilter}
        selectOptions={selectExpenseOptions}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <div className="p-5">
        <ExpensesTable
          budget={budgetInfo}
          userCurrencySymbol={userCurrencySymbol}
          expenses={filteredExpenses}
          userData={userData}
          refreshData={fetchAllData} // Pass the function to refresh the list
        />
      </div>
    </>
  );
}
