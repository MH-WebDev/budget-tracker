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
    <div className="border rounded-md p-5 flex h-[220px] flex-col shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105 text-gray-700">
        <div className="flex flex-row justify-between items-center w-auto pb-5">
          <div className="flex flex-row items-center gap-5">
            <p className="text-xl h-[50px] w-[50px] text-center p-2 rounded-md border bg-gray-50 shadow-sm">{budget?.icon}</p>
            <h2 className="text-lg font-semibold">{budget.budgetName}</h2>
          </div>
          <div>
            <h3>Transaction Count: {budget.totalItems}</h3>
            <h4>Created By: {budget.userFirstName}</h4>
          </div>
        </div>
        <div className="py-5">
          <h3 className="text-md font-semibold text-gray-700">Total Amount: <span className="font-normal">{preferredCurrency}{budget.amount}</span></h3>
        </div>
        <div className="w-full">
          <div className="flex flex-row justify-between px-1 items-center mb-2">
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