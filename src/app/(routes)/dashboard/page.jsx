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

  if (loading) {
    return <Loading />;
  }

  const totalBudgetAmount = budgetData.reduce((acc, budget) => acc + budget.amount, 0).toFixed(2) || 0;;
  const totalExpenseAmount = expenseData.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2) || 0;
  const totalIncomeAmount = incomeData.reduce((acc, income) => acc + income.amount, 0).toFixed(2) || 0;
  const userCurrencySymbol = userData?.preferred_currency_symbol || " ";
  return (
    <div className="p-5">
      Dashboard
      <div className="flex flex-row gap-5 justify-center items-center py-5">
        <div className="border border-gray-300 rounded-md h-52 w-full p-5">
          <h2>Totals</h2>
          <h3>Total budget amount: {userCurrencySymbol}{totalBudgetAmount}</h3>
          <h3>Total Expenses: {userCurrencySymbol}{totalExpenseAmount}</h3>
          <h3>Total Income: {userCurrencySymbol}{totalIncomeAmount}</h3>
        </div>
        <div className="border border-gray-300 rounded-md h-52 w-full p-5">
          <h2>Latest Expenses</h2>
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

