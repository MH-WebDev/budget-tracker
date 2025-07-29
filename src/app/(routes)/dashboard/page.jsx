'use client'
import Loading from '@/app/_components/Loading';
import { useDatabase } from '@/context/DatabaseContext';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import DashboardIncomes from './_components/DashboardIncomes';
import DashboardBudgets from './_components/DashboardBudgets';
import DashboardExpenses from './_components/DashboardExpenses';

export default function page() {
  const { user } = useUser();
  const { fetchBudgetExpenseData, userData, fetchIncomeData } = useDatabase();
  const [budgetData, setBudgetData] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetches all data when either the component mounts or userData is changed
  // This ensures that data is always up-to-date
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [userData, user]);

  // Function to fetch all data using functions from DatabaseContext
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      //Fetching budget and expense data
      const data = await fetchBudgetExpenseData(
        userData?.selected_date_format || "MM/dd/yyyy"
      );
      if (data) {
        setBudgetData(data?.budgets);
        setExpenseData(data?.expenses);
      } else {
        setError("Failed to fetch data");
      }
       // Fetching income data
      const incomes = await fetchIncomeData();
      setIncomeData(incomes || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  // Show loading component while data is being fetched. This should ensure user doesn't see an empty page or error state due to data being unavailable
  if (loading) {
    return <Loading />;
  }

  const totalBudgetAmount = budgetData.reduce((acc, budget) => acc + budget.amount, 0).toFixed(2) || 0;;
  const totalExpenseAmount = expenseData.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2) || 0;
  const totalIncomeAmount = incomeData.reduce((acc, income) => acc + income.amount, 0).toFixed(2) || 0;
  const userCurrencySymbol = userData?.preferred_currency_symbol || " "; // Defaults to empty space if unavailable

  return (
    <div className="p-5">
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center py-5">
        <div className="border border-gray-300 rounded-md h-52 w-full p-5">
          <h2 className="font-semibold text-lg pb-5">Totals</h2>
          <div className="flex flex-col justify-between gap-2">
            <h3 className="font-semibold">Total budget amount: <span className="font-normal">{userCurrencySymbol}{totalBudgetAmount}</span></h3>
            <h3 className="font-semibold">Total Expenses: <span className="font-normal">{userCurrencySymbol}{totalExpenseAmount}</span></h3>
            <h3 className="font-semibold">Total Income: <span className="font-normal">{userCurrencySymbol}{totalIncomeAmount}</span></h3>
          </div>
        </div>
        <div className="border border-gray-300 rounded-md h-52 w-full p-5">
          <h2 className="font-semibold text-lg pb-5">Latest Expenses</h2>
          <div className="flex flex-col justify-between gap-2">
            {expenseData
              .slice() // create a copy so as to not mutate the original array
              .sort((a, b) => new Date(b.expense_created_timestamp) - new Date(a.expense_created_timestamp)) // Sort by most recent
              .slice(0, 3) // Limit to 3 most recent expenses
              .map((expense, index) => (
                <div key={index} className="grid grid-cols-9 gap-2">
                  <span className="col-span-1">{expense.icon}</span>
                  <span className="col-span-2">{expense.category}</span>
                  <span className="col-span-6 text-left">{userCurrencySymbol}{expense.amount.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="border border-gray-300 rounded-md h-52 w-full p-5">
          <h2 className="font-semibold text-lg pb-5">Latest Incomes</h2>
          <div className="flex flex-col justify-between gap-2">
            {incomeData
              .slice() // create a copy so as to not mutate the original array
              .sort((a, b) => new Date(b.expense_created_timestamp) - new Date(a.expense_created_timestamp)) // Sort by most recent
              .slice(0, 3) // Limit to 3 most recent incomes
              .map((expense, index) => (
                <div key={index} className="grid grid-cols-9 gap-2">
                  <span className="col-span-1">{expense.icon}</span>
                  <span className="col-span-2">{expense.category}</span>
                  <span className="col-span-6 text-left">{userCurrencySymbol}{expense.amount.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <DashboardBudgets budgetData={budgetData} expenseData={expenseData} userData={userData} userCurrencySymbol={userCurrencySymbol}/>
        <DashboardExpenses budgetData={budgetData} expenseData={expenseData} userData={userData} userCurrencySymbol={userCurrencySymbol}/>
        <DashboardIncomes incomeData={incomeData} userData={userData} userCurrencySymbol={userCurrencySymbol}/>
      </div>
    </div>
  )
}

