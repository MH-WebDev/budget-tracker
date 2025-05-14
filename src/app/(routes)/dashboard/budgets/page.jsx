'use client'
import React, { useState, useEffect } from 'react'
import { useDatabase } from '@/context/DatabaseContext';
import BudgetList from './_components/BudgetList'
import Loading from '@/app/_components/Loading';
import { useUser } from '@clerk/nextjs';

function page() {
    const { user } = useUser();
    const { budgets, expenses, userData, fetchBudgetExpenseData, updateBudget } = useDatabase(); // Access data and fetch function from DatabaseProvider
    const [loading, setLoading] = useState(true); // Loading state

// Refresh budgets and expenses
  // Fetch budgets and expenses and manage loading state
  const refreshBudgetsAndExpenses = async () => {
    setLoading(true);
    try {
      await fetchBudgetExpenseData();
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (user) {
      refreshBudgetsAndExpenses();
    }
  }, [userData, user]);
  
   if (loading) {
     return <Loading />
   }
  return (
    <div>Budgets
      <BudgetList
          user={userData[0]} // Pass the first user object
          budgets={budgets} // Pass the current budget
          expenses={expenses} // Filter expenses by budget ID
          refreshData={refreshBudgetsAndExpenses}
          updateBudget={updateBudget}/>
    </div>
  )
}

export default page