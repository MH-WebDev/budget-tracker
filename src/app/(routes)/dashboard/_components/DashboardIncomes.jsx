import PieChart from '@/app/_components/PieChart';
import React, { useState } from 'react'

export default function DashboardIncomes({ incomeData, userData, userCurrencySymbol}) {
    const totalIncomeQuantity = incomeData.length
    const totalIncomeAmount = incomeData.reduce((a,v) => a = a +v.amount, 0).toFixed(2) || 0;
    const [daysFilter, setDaysFilter] = useState(7); // Default filter to 7 days
    
// CHART DATA PROCESSING
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
         { v: amount, f: `${userCurrencySymbol}${amount}` } // 'f' is the formatted value
       ])
     ];
// END OF CHART DATA PROCESSING
// BEGIN RECENT INCOME FILTER PROCESSING
     const now = new Date();
     const filteredIncomes = incomeData.filter(income => {
        const incomeDate = new Date(income.income_created_timestamp);
        const timeDifference = now - incomeDate;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        return daysDifference <= daysFilter;
     });
// END RECENT INCOME FILTER PROCESSING
  return (
    <div className="border rounded-md p-5">
        <h2 className="font-semibold text-lg pb-5">Incomes</h2>
        <div className="flex flex-col gap-2 mb-5">
            <h3 className="font-semibold">Total Income Sources: <span className="font-normal">{totalIncomeQuantity}</span></h3>
            <h3 className="font-semibold">Total Income Amount: <span className="font-normal">{userCurrencySymbol}{totalIncomeAmount}</span></h3>
        </div>
        <div className="flex flex-row gap-5 justify-center w-full">
            <div className="border rounded-md p-5 w-full h-[350px]">
                <PieChart chartData={chartData} userCurrency={userCurrencySymbol} chartWidth={"100%"} chartHeight={"300px"}/>
            </div>
            <div className="w-full border rounded-md p-5 h-[350px]">
                <h3>Recent Incomes:</h3>
                <div className="flex flex-row gap-5 py-2">
                    <button onClick={() => setDaysFilter(7)} className={`${daysFilter === 7 ? "font-bold underline" : ""}`}>7 days</button>
                    <button onClick={() => setDaysFilter(14)} className={daysFilter === 14 ? "font-bold underline" : ""}>14 days</button>
                    <button onClick={() => setDaysFilter(30)} className={daysFilter === 30 ? "font-bold underline" : ""}>30 days</button>
                </div>
                <div className=" overflow-y-scroll h-[250px]">
                    <ul>
                        {filteredIncomes.length === 0 && <li>No incomes found during this time period.</li>}
                        {filteredIncomes.map((income, idx) => (
                            <li key={income.id || idx} className="flex gap-4 items-center border border-gray-300 rounded-md py-2 odd:bg-gray-200">
                            <span>{income.icon}</span>
                            <span>{income.category}</span>
                            <span>{userCurrencySymbol}{income.amount}</span>
                            <span>{new Date(income.income_created_timestamp).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
  )
}