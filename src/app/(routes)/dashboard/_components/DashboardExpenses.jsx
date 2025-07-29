import React, { useState } from "react";
import { format } from "date-fns";
import AreaChart from "@/app/_components/AreaChart";
import DateRangeButtons from "./DateRangeButtons";

function DashboardExpenses({
  budgetData,
  expenseData,
  userData,
  userCurrencySymbol,
}) {
  const totalExpenseQuantity = expenseData.length || 0;
  const totalExpenseAmount =
    expenseData.reduce((a, v) => a + v.amount, 0).toFixed(2) || 0;
  const [daysFilter, setDaysFilter] = useState(30); // Default filter to 30 days

  const dateFormat = userData?.selected_date_format || "dd/MM/yyyy";
  // CHART DATA GENERATION
  // Remove year tokens from the format string
  const formatWithoutYear = dateFormat.replace(/[-/.,\s]*y{1,4}[-/.,\s]*/gi, "");

  //Find the earliest expense date for "All" option
  const allDates = expenseData.map(exp => new Date(exp.updated_at));
  const earliestDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
  const today = new Date();

  // Calculate total days for "All" or default to 30
  const totalDays = daysFilter === 0 
    ? Math.ceil((today - earliestDate) / (1000 * 60 * 60 * 24)) + 1 : 30;

  // Generate days array
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (totalDays - 1 - i));
    return d;
  });

  // Only including days within the selected date range
  const filteredDays = daysFilter === 0 ? days : days.slice(-daysFilter);
  
  // Build chart data: header row first
  // Header: Date, ...each budget name, "Total"
  const chartData = [
    ["Date", ...budgetData.map((b) => b.budget_name), "Total"],
  ];
  console.log(chartData)
  // 3. For each day, calculate expenses for each budget and total
  filteredDays.forEach((dateObj) => {
    const formattedDate = format(dateObj, formatWithoutYear.trim());
    const isoDate = dateObj.toISOString().slice(0, 10); // For comparison

    // For each budget, sum expenses for this day
    const budgetExpenses = budgetData.map((budget) => {
      const sum = expenseData
        .filter((exp) => {
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
  // END CHART DATA GENERATION
  // ----------------------------------------
  // CALCULATING TOTAL EXPENSE AMOUNT FOR GIVEN DATE RANGE
    // 1. Get the filtered date strings
const filteredDateStrings = filteredDays.map(d => d.toISOString().slice(0, 10));

// 2. Filter expenses within the selected date range
const filteredExpenses = expenseData.filter(exp => 
  filteredDateStrings.includes(new Date(exp.updated_at).toISOString().slice(0, 10))
);

// 3. Calculate total expense amount for the filtered range
const filteredExpenseAmount = filteredExpenses
  .reduce((a, v) => a + v.amount, 0)
  .toFixed(2);

    // END TOTAL BUDGET AMOUNT CALCULATION
    // ----------------------------------------------------

  return (
    <div className="border rounded-md p-5">
      <h2 className="font-semibold text-lg pb-5">Expenses {daysFilter === 0 ? "" : `(Past ${daysFilter} days)`}</h2>
      <div className="flex flex-col md:flex-row justify-between md:items-end">
        <div className="flex flex-col gap-2 mb-5">
          <h3 className="font-semibold">
            Total Expenses:<span className="font-normal"> {totalExpenseQuantity}</span>
          </h3>
          <h3 className="font-semibold">
            Total Expenses Amount:<span className="font-normal"> {userCurrencySymbol}{filteredExpenseAmount}</span>
          </h3>
        </div>
        <div className="mb-5">
          <DateRangeButtons
          daysFilter={daysFilter}
          setDaysFilter={setDaysFilter}
          />
        </div>
      </div>
      <div className="w-full border rounded-md p-5">
        <h2>Daily expenses over time:</h2>
        <AreaChart
          chartData={chartData}
          chartWidth={"100%"}
          chartHeight={"450px"}
          chartTitle={daysFilter === 0 ? 'Expenses grouped by budget since account creation' : `Expenses grouped by budget over the past ${daysFilter} days`}
          hTitle="Date"
          columnMin="0"
        />
      </div>
    </div>
  );
}

export default DashboardExpenses;
