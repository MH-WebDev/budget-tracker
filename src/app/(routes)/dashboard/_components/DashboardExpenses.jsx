import React, { useState } from 'react'
import { format } from "date-fns";
import AreaChart from '@/app/_components/AreaChart';

function DashboardExpenses({budgetData, expenseData, userData, userCurrencySymbol}) {
    const totalExpenseQuantity = expenseData.length || 0;
    const totalExpenseAmount = expenseData.reduce((a, v) => a + v.amount, 0).toFixed(2) || 0;
    const [daysFilter, setDaysFilter] = useState(30); // Default filter to 30 days

    const dateFormat = userData?.selected_date_format || "dd/MM/yyyy";

    // Remove year tokens from the format string
    const formatWithoutYear = dateFormat
    .replace(/y{1,4}/gi, "")   // Remove 'y', 'yy', 'yyy', 'yyyy'
    .replace(/[-/.,\s]+$/, "") // Remove trailing separators
    
    // Creates an array of the last 30 days as date objects
       const days = Array.from({ length: 30 }, (_, i) => {
       const d = new Date();
       d.setDate(d.getDate() - (29 - i));
         return d;
       });
    

    // 2. Build chart data: header row first
    // Header: Date, ...each budget name, "Total"
    const chartData = [
        ["Date", ...budgetData.map(b => b.budget_name), "Total"]
    ];

    // 3. For each day, calculate expenses for each budget and total
    days.forEach(dateObj => {
        const formattedDate = format(dateObj, formatWithoutYear.trim());
        const isoDate = dateObj.toISOString().slice(0, 10); // For comparison

        // For each budget, sum expenses for this day
        const budgetExpenses = budgetData.map(budget => {
        const sum = expenseData
            .filter(exp => {
            const expDate = new Date(exp.updated_at).toISOString().slice(0, 10);
            return exp.budget_id === budget.id && expDate === isoDate;
            })
            .reduce((acc, exp) => acc + exp.amount, 0);
        return sum;
        });

        // Combined total for this day
        const total = budgetExpenses.reduce((a, b) => a + b, 0);

        // Optionally, format with currency for tooltips:
        // row.push({ v: sum, f: `${userCurrencySymbol}${sum}` });

        chartData.push([formattedDate, ...budgetExpenses, total]);
    });

  return (
    <div className="border rounded-md p-5">
        <h2 className="font-semibold text-lg pb-5">Expenses</h2>
        <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2 mb-5">
                <h3 className="font-semibold">Number of Expenses: <span className="font-normal">{totalExpenseQuantity}</span></h3>
                <h3 className="font-semibold">Total Expenses Amount: <span className="font-normal">{userCurrencySymbol}{totalExpenseAmount}</span></h3>
            </div>
            <div className="flex flex-row gap-2">
                <button onClick={() => setDaysFilter(7)} className={`${daysFilter === 7 ? "font-bold underline" : ""}`}>7 Days</button>
                <button onClick={() => setDaysFilter(14)} className={daysFilter === 14 ? "font-bold underline" : ""}>14 Days</button>
                <button onClick={() => setDaysFilter(30)} className={daysFilter === 30 ? "font-bold underline" : ""}>30 Days</button>
            </div>
        </div>
        <div className="w-full border rounded-md p-5">
            <AreaChart chartData={chartData} chartWidth={"100%"} chartHeight={"450px"} chartTitle="Daily expenses over time" vTitle="Daily Expenses" hTitle="Date"/>
        </div>
    </div>
  )
}

export default DashboardExpenses