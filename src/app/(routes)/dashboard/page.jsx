'use client'
import Loading from '@/app/_components/Loading';
import { useDatabase } from '@/context/DatabaseContext';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

function page() {
  const { user } = useUser();
  const { fetchBudgetExpenseData, userData, addExpense } = useDatabase();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expenseInfo, setExpenseInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [userData, user]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      //Fetching budget and expense data
      const data = await fetchBudgetExpenseData(
        userData[0]?.selected_date_format || "MM/dd/yyyy"
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

  const totalBudgetAmount = budgetInfo.reduce((acc, budget) => acc + budget.amount, 0);
  const totalExpenseAmount = expenseInfo.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="p-5">
      Dashboard
      <div className="flex flex-row gap-5 justify-center items-center py-5">
        <div className="border border-gray-300 rounded-md h-52 w-full">
          <h2>Totals</h2>
          <h3>Total budget amount: {totalBudgetAmount}</h3>
          <h3>Total Expenses: {totalExpenseAmount}</h3>
        </div>
        <div className="border border-gray-300 rounded-md h-52 w-full">
          <h2>Latest Expenses</h2>
        </div>
      </div>
    </div>
  )
}

export default page