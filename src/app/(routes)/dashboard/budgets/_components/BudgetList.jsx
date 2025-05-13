'use client';
import React, { useEffect, useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import BudgetCard from './BudgetCard';
import CreateBudget from './CreateBudget';
import Loading from '@/app/_components/Loading';

function BudgetList() {
  const { budgets, expenses, userData, fetchBudgetExpenseData, updateBudget } = useDatabase(); // Access data and fetch function from DatabaseProvider
    const [loading, setLoading] = useState(true); // Loading state


  // Refresh budgets and expenses
  const refreshBudgetsAndExpenses = async () => {
    await fetchBudgetExpenseData(); // Fetch budgets and expenses from the context
  };

  // Fetch data when the component mounts
  useEffect(() => {
    refreshBudgetsAndExpenses();
  }, []);
  
  // if (loading) {
  //   return <Loading />
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
      {budgets.map((budgets, index) => (
        <BudgetCard
          key={budgets.id}
          user={userData[0]} // Pass the first user object
          budget={budgets} // Pass the current budget
          expenses={expenses.filter((expense) => expense.budget_id === budgets.id)} // Filter expenses by budget ID
          index={index}
          refreshData={refreshBudgetsAndExpenses}
          updateBudget={updateBudget}
        />
      ))}
      <CreateBudget onBudgetCreated={refreshBudgetsAndExpenses} />
    </div>
  );
}

export default BudgetList;