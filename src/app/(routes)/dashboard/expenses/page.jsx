"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useDatabase } from "@/context/DatabaseContext";
import ExpensesTable from "./_components/ExpensesTable";
import Loading from "@/app/_components/Loading";
import FilterComponent from "../_components/FilterComponent";
import { selectExpenseOptions } from "@/app/_components/Categories";

function page() {
  const { user } = useUser();
  const { fetchBudgetExpenseData, userData, addExpense } = useDatabase();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expenseInfo, setExpenseInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysFilter, setDaysFilter] = useState(0); // Default time filter to last 30 days

  const allCategoryValues = selectExpenseOptions.filter(opt => opt.value !== "All").map(opt => opt.value);
  const [selectedCategories, setSelectedCategories] = useState(allCategoryValues);
  const userCurrencySymbol = userData?.preferred_currency_symbol || " ";

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [userData, user]); // Fetch or update data when either userData or user is available

  // BEGIN DATA FETCHING FUNCTION
  // Fetches budget and expense data from the database via DatabaseContext and updates the state
  // Called on page load and when userData or user changes
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      //Fetching budget and expense data
      const data = await fetchBudgetExpenseData(
        userData?.selected_date_format || "MM/dd/yyyy"
      );
      if (data) {
        setBudgetInfo(data.budgets);
        setExpenseInfo(data.expenses);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  // END DATA FETCHING FUNCTION
  // ------------------------------------
  // BEGIN DATA FILTERING LOGIC
  // Filter expenses based on selected categories and by the selected time period
  const now = new Date();


  const filteredExpenses = expenseInfo.filter(exp => { // Array output of filter function
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
      <div className="p-5">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <FilterComponent
          daysFilter={daysFilter}
          setDaysFilter={setDaysFilter}
          selectOptions={selectExpenseOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        {filteredExpenses.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            <p>No data available for the selected filters.</p>
          </div>
        ):(
          <ExpensesTable
            budget={budgetInfo}
            expenses={filteredExpenses}
            userCurrencySymbol={userCurrencySymbol}
            userData={userData}
            refreshData={fetchAllData} // Pass the function to refresh the list
          />
        )}
      </div>
    </>
  );
}

export default page;
