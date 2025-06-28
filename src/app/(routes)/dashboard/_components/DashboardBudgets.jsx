
import AreaChart from '@/app/_components/AreaChart'
import React, { useState } from 'react'
import { format } from "date-fns";

export default function DashboardBudgets({ budgetData, expenseData, userData, userCurrencySymbol}) {
    const totalBudgetQuantity = budgetData.length
    const totalBudgetAmount = budgetData.reduce((a,v) => a = a +v.amount, 0).toFixed(2) || 0;
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
  const chartData = [
    ["Date", ...budgetData.map(b => b.budget_name)]
  ];

  // 3. For each day, calculate available budget for each budget
  days.forEach(dateObj => {
    // Format date for the user's preference
    const formattedDate = format(dateObj, formatWithoutYear.trim());
    const isoDate = dateObj.toISOString().slice(0, 10); // For comparison

    const row = [formattedDate];
    budgetData.forEach(budget => {
      const spent = expenseData
        .filter(exp => {
          const dateString = new Date(exp.updated_at).toISOString().slice(0, 10);
          return exp.budget_id === budget.id && dateString <= isoDate;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
      const available = budget.amount - spent;
      // Provide both value and formatted value for tooltip/label
      row.push({ v: available, f: `${userCurrencySymbol}${available}` });
    });
    chartData.push(row);
  });

    return (
      <div className="border rounded-md p-5">
          <h2 className="font-semibold text-lg pb-5">Budgets</h2>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2 mb-5">
                <h3 className="font-semibold">Number of Budgets: <span className="font-normal">{totalBudgetQuantity}</span></h3>
                <h3 className="font-semibold">Total Budget Amount: <span className="font-normal">{userCurrencySymbol}{totalBudgetAmount}</span></h3>
            </div>
            <div className="flex flex-row gap-2">
                <button onClick={() => setDaysFilter(7)} className={`${daysFilter === 7 ? "font-bold underline" : ""}`}>7 Days</button>
                <button onClick={() => setDaysFilter(14)} className={daysFilter === 14 ? "font-bold underline" : ""}>14 Days</button>
                <button onClick={() => setDaysFilter(30)} className={daysFilter === 30 ? "font-bold underline" : ""}>30 Days</button>
            </div>
        </div>
          <div className="flex flex-row gap-5 justify-center w-full">
              <div className="w-full border rounded-md p-5">
                  Available Budget Over Time
                  <AreaChart chartData={chartData} chartWidth={"100%"} chartHeight={"450px"} chartTitle="Budgets and their relevant expenses over the past 30 days" vTitle="Available Budget" hTitle="Date" />
              </div>
          </div>
      </div>
      
    )
}
