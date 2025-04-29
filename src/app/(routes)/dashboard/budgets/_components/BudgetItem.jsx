import React from 'react'

import { useUser } from '@clerk/nextjs'

function BudgetItem({budget, index}) {
  
      const {user} = useUser()
      const preferredCurrency = user?.publicMetadata?.currencySymbol || 'USD'; // Default to USD if not set
  return (
    <div className="border rounded-md text-center p-5 flex flex-col justify-center items-center shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
        <h2>{budget?.icon}</h2>
        <h2>{budget.budgetName}</h2>
        <h3>Total Amount: {preferredCurrency}{budget.amount}</h3>
        <h3>Transaction Count: {budget.totalItems}</h3>
        <h4>Created By: {budget.userFirstName}</h4>
    </div>
  )
}

export default BudgetItem