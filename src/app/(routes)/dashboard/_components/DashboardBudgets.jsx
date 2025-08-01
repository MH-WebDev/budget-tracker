import AreaChart from "@/app/_components/AreaChart";
import React, { useState } from "react";
import { format } from "date-fns";
import DateRangeButtons from "./DateRangeButtons";

export default function DashboardBudgets({
  budgetData,
  expenseData,
  userData,
  userCurrencySymbol,
}) {
  const totalBudgetQuantity = budgetData.length;
  const totalBudgetAmount =
    budgetData.reduce((a, v) => (a = a + v.amount), 0).toFixed(2) || 0;
  const [daysFilter, setDaysFilter] = useState(30); // Default filter to 30 days

  const dateFormat = userData?.selected_date_format || "dd/MM/yyyy";
  // BEGIN CHART DATA GENERATION
  // Remove year tokens from the format string
  const formatWithoutYear = dateFormat.replace(
    /[-/.,\s]*y{1,4}[-/.,\s]*/gi,
    ""
  );
  // Find the earliest expense date for "All" option
  const allDates = expenseData.map((exp) => new Date(exp.updated_at));
  const earliestDate =
    allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
  const today = new Date();
  // Calculate total days for "All (0)" or default to 30
  const totalDays =
    daysFilter === 0
      ? Math.ceil((today - earliestDate) / (1000 * 60 * 60 * 24)) + 1
      : 30;
  // Generate days array
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (totalDays - 1 - i));
    return d;
  });
  // Only including days within the selected date range
  const filteredDays = daysFilter === 0 ? days : days.slice(-daysFilter);
  // Build chart data: header row first
  const chartData = [["Date", ...budgetData.map((b) => b.budget_name)]];
  // For each day, calculate available budget for each budget
  filteredDays.forEach((dateObj) => {
    // Format date as per user preference set in userData
    // Removes year from the date format to keep things tidy
    const formattedDate = format(dateObj, formatWithoutYear.trim());
    const isoDate = dateObj.toISOString().slice(0, 10); // For comparison

    const row = [formattedDate];
    budgetData.forEach((budget) => {
      const spent = expenseData
        .filter((exp) => {
          const dateString = new Date(exp.updated_at)
            .toISOString()
            .slice(0, 10);
          return exp.budget_id === budget.id && dateString <= isoDate;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
      const available = budget.amount - spent;
      // Provide both value and formatted value for tooltip/label
      row.push({ v: available, f: `${userCurrencySymbol}${available}` });
    });
    chartData.push(row);
  });
  // Date range filter logic
  const now = new Date();

  //END CHART DATA GENERATION
  // ----------------------------------------------------
  // CALCULATING TOTAL BUDGET AMOUNT FOR GIVEN DATE RANGE
  // 1. Get the filtered date strings
  const filteredDateStrings = filteredDays.map((d) =>
    d.toISOString().slice(0, 10)
  );

  // 2. Find budgets with expenses in the filtered range
  const activeBudgetIds = new Set(
    expenseData
      .filter((exp) =>
        filteredDateStrings.includes(
          new Date(exp.updated_at).toISOString().slice(0, 10)
        )
      )
      .map((exp) => exp.budget_id)
  );

  // 3. Calculate totalBudgetAmount for active budgets only
  const filteredBudgetAmount = budgetData
    .filter((budget) => activeBudgetIds.has(budget.id))
    .reduce((a, v) => a + v.amount, 0)
    .toFixed(2);
  // END TOTAL BUDGET AMOUNT CALCULATION
  // ----------------------------------------------------
  return (
    <div className="border rounded-md p-5">
      <h2 className="font-semibold text-lg pb-5">
        Budgets {daysFilter === 0 ? "" : `(Past ${daysFilter} days)`}
      </h2>
      <div className="flex flex-col md:flex-row justify-between md:items-end">
        <div className="flex flex-col gap-2 mb-5">
          <h3 className="font-semibold">
            Number of Budgets:{" "}
            <span className="font-normal">{totalBudgetQuantity}</span>
          </h3>
          <h3 className="font-semibold">
            Total Budget Amount:{" "}
            <span className="font-normal">
              {userCurrencySymbol}
              {filteredBudgetAmount}
            </span>
          </h3>
        </div>
        <div className="mb-5">
          <DateRangeButtons
            daysFilter={daysFilter}
            setDaysFilter={setDaysFilter}
          />
        </div>
      </div>
      <div className="flex flex-row gap-5 justify-center w-full">
        <div className="w-full border rounded-md p-5">
          <h2>Available Budget Over Time</h2>
          <AreaChart
            chartData={chartData}
            chartWidth={"100%"}
            chartHeight={"450px"}
            chartTitle={
              daysFilter === 0
                ? "Budgets and their expenses since account creation"
                : `Budgets and their relevant expenses over the past ${daysFilter} days`
            }
            vTitle="Available Budget"
            hTitle="Date"
          />
        </div>
      </div>
    </div>
  );
}
