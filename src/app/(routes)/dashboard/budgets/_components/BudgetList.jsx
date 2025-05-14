'use client';
import React from 'react';
import BudgetCard from './BudgetCard';
import CreateBudget from './CreateBudget';

function BudgetList({ budgets, expenses, user, refreshData, updateBudget, deleteBudget }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
      {budgets.map((budgets, index) => (
        <BudgetCard
          key={budgets.id}
          user={user} // Pass the first user object
          budget={budgets} // Pass the current budget
          expenses={expenses.filter((expense) => expense.budget_id === budgets.id)} // Filter expenses by budget ID
          index={index}
          refreshData={refreshData}
          updateBudget={updateBudget}
          deleteBudget={deleteBudget}
        />
      ))}
      <CreateBudget onBudgetCreated={refreshData} />
    </div>
  );
}

export default BudgetList;