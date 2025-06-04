// import { PieChart } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import * as d3 from "d3";
import {PieChartIncome} from "./PieChartIncome"

export default function IncomesInfo({incomeData, userData, userCurrencySymbol}) {
    const totalIncomeQuantity = incomeData.length
    const totalIncomeAmount = incomeData.reduce((a,v) => a = a +v.amount, 0)

      // Group by category and sum amounts
    const categoryTotals = incomeData.reduce((acc, curr) => {
        if (!acc[curr.category]) {
        acc[curr.category] = 0
        }
        acc[curr.category] += curr.amount
        return acc
    }, {})

    // Format for PieChart
    const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
        id: category,
        value: amount,
        name: category,
    }))


    

return (
    <div className="col-span-8 lg:col-span-6 w-full border rounded-md p-5 flex flex-row gap-5 justify-between items-center h-[200px] shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
        <div className="flex flex-col gap-5 font-semibold">
            <p>Income sources: <span className="font-normal">{totalIncomeQuantity}</span></p>
            <p>Total Income: <span className="font-normal">{userCurrencySymbol}{totalIncomeAmount}</span></p>
        </div>
        <div>
            <PieChartIncome pieData={pieData} userData={userData}/>
        </div>
    </div>
  )
}

