import React from 'react'

function BudgetItem({budget, index}) {
  return (
    <div className="border rounded-md text-center p-5 flex flex-col justify-center items-center w-48 shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
        <h2>{budget?.icon}</h2>
        <h2>{budget.budgetName}</h2>
        <h3>{budget.amount}</h3>
        <h3>{budget.totalItems}</h3>
        <h4>{budget.createdBy}</h4>
    </div>
  )
}

export default BudgetItem