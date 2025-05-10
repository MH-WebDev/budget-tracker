'use client';
import React, { useEffect } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import BudgetCard from './BudgetCard';
import CreateBudget from './CreateBudget';

function BudgetList() {
  const { budgets, expenses, userData, fetchBudgetExpenseData } = useDatabase(); // Access data and fetch function from DatabaseProvider

  // Refresh budgets and expenses
  const refreshBudgetsAndExpenses = async () => {
    console.log('Refreshing budgets and expenses...');
    await fetchBudgetExpenseData(); // Fetch budgets and expenses from the context
  };

  // Fetch data when the component mounts
  useEffect(() => {
    refreshBudgetsAndExpenses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
      {budgets.map((budget, index) => (
        <BudgetCard
          key={budget.id}
          user={userData[0]} // Pass the first user object
          budget={budget} // Pass the current budget
          expenses={expenses.filter((expense) => expense.budget_id === budget.id)} // Filter expenses by budget ID
          index={index}
        />
      ))}
      <CreateBudget onBudgetCreated={refreshBudgetsAndExpenses} />
    </div>
  );
}

export default BudgetList;