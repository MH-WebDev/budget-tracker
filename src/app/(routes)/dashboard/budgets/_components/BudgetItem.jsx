import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

function BudgetItem({budget, index}) {
  
      const {user} = useUser()
      const preferredCurrency = user?.publicMetadata?.currencySymbol || 'USD'; // Default to USD if not set

      const [percentage, setPercentage] = useState(0); // Setup for percentage bar calculation

      useEffect(() => {
        if (budget.amount > 0) {
          const calculatedPercentage = ((budget.totalSpend / budget.amount) * 100).toFixed(0);
          setPercentage(calculatedPercentage)
        }
      })
  return (
    <div className="border rounded-md text-center p-5 flex flex-col justify-center items-center shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
        <h2>{budget?.icon}</h2>
        <h2>{budget.budgetName}</h2>
        <h3>Total Amount: {preferredCurrency}{budget.amount}</h3>
        <h3>Transaction Count: {budget.totalItems}</h3>
        <h4>Created By: {budget.userFirstName}</h4>
        <div className="w-full">
          <div className="flex flex-row justify-between px-10 items-center mb-2">
            <h2 className="text-xs">${budget.totalSpend?budget.totalSpend:0} Spent</h2>
            <h2 className="text-xs">${budget.amount - budget.totalSpend} Remaining</h2>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div style={{width: `${percentage}%`}}className={`bg-purple-700 h-2 rounded-full`}>

            </div>
          </div>
        </div>
        
    </div>
  )
}

export default BudgetItem