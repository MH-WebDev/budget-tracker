import React, { useEffect, useState } from 'react'

export default function BudgetsInfo({budget, userData}) {
  const totalBudgetQuantity = budget.length
  const totalBudgetAmount = budget.reduce((a,v) => a = a +v.amount, 0)
  const totalBudgetSpent = budget.reduce((a,v) => a = a +v.totalSpend, 0)
  const userCurrencySymbol = userData.preferred_currency_symbol || " ";
  const [percentage, setPercentage] = useState(0);

    useEffect(() => {
      if (totalBudgetAmount > 0) {
        const calculatedPercentage = (
          (totalBudgetSpent / totalBudgetAmount) * 100).toFixed(0);
          setPercentage(Math.min(calculatedPercentage, 100));
        }
      }, [totalBudgetAmount, totalBudgetSpent]);


  return (
    <div className="border rounded-md p-5 flex flex-col justify-center gap-5 h-[200px] font-semibold shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105>BudgetsInfo</divclassName=border">
        <p>Number of budgets: <span className="font-normal">{totalBudgetQuantity}</span></p>
        <p>Total Budget Amount: <span className="font-normal">{userCurrencySymbol}{totalBudgetAmount}</span></p>
        <p>Total Spend: <span className="font-normal">{userCurrencySymbol}{totalBudgetSpent}</span></p>
        <div>
          <div className="flex flex-row justify-between text-xs">
            <p>Total Budget Amount: <span className="font-normal">{userCurrencySymbol}{totalBudgetAmount}</span></p>
            <p>Total Spend: <span className="font-normal">{userCurrencySymbol}{totalBudgetSpent}</span></p>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div
              style={{ width: `${percentage}%` }}
              className={`bg-purple-700 h-2 rounded-full`}
            ></div>
          </div>
        </div>
    </div>
  )
}

