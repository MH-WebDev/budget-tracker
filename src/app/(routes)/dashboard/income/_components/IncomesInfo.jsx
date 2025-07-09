// import { PieChart } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import PieChart from '@/app/_components/PieChart';

export default function IncomesInfo({incomeData, userData, userCurrencySymbol}) {
    const totalIncomeQuantity = incomeData.length
    const totalIncomeAmount = incomeData.reduce((a,v) => a = a +v.amount, 0)
    const userCurrency = userData?.preferred_currency_symbol || "";

    // Group by category and sum amounts
    const categoryTotals = incomeData.reduce((acc, curr) => {
        if (!acc[curr.category]) {
            acc[curr.category] = 0;
        }
        acc[curr.category] += curr.amount;
        return acc;
    }, {});

    // Format for react-google-charts
    const chartData = [
      ["Category", "Amount"],
      ...Object.entries(categoryTotals).map(([category, amount]) => [
        category,
        { v: amount, f: `${userCurrency}${amount}` } // 'f' is the formatted value
      ])
    ];

    const largestSource = Object.entries(categoryTotals).reduce(
      (max, [category, amount]) => 
        amount > max.amount ? {category, amount } : max,
      {category: null, amount: 0}
    );

return (
    <div className="col-span-8 lg:col-span-6 w-full border rounded-md p-5 flex flex-row gap-5 justify-between items-center h-[200px] shadow-sm hover:bg-gray-50 hover:shadow-md">
        <div className="flex flex-col gap-5 font-semibold">
            <p>Income sources: <span className="font-normal">{totalIncomeQuantity}</span></p>
            <p>Total Income: <span className="font-normal">{userCurrencySymbol}{totalIncomeAmount}</span></p>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold"> Largest source:</h3>
          {largestSource.category ? `${largestSource.category} (${userCurrency}${largestSource.amount})` : "N/A"}
        </div>
        <div>
            <PieChart chartData={chartData} userCurrency={userCurrency}/>
        </div>
    </div>
  )
}

