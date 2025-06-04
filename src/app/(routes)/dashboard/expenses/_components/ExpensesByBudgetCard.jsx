import { user_data } from "@/db/schema";
import React, { useEffect, useState } from "react";

function ExpensesByBudgetCard({ budget, userData }, index) {
  // This component displays the budget header for expenses, including the budget name, total amount, and a progress bar showing the percentage spent.

  const [percentage, setPercentage] = useState(0); // Setup for percentage bar calculation
  const userCurrencySymbol = userData.preferred_currency_symbol || " ";

  useEffect(() => {
    if (budget.amount > 0) {
      const calculatedPercentage = (
        (budget.totalSpend / budget.amount) *
        100
      ).toFixed(0);
      setPercentage(Math.min(calculatedPercentage, 100));
    }
  }, [budget.amount, budget.totalSpend]);

  return (
    <div className="">
      <div className="border rounded-md p-5 flex h-[220px] flex-col shadow-sm text-gray-700">
        <div className="flex flex-row justify-between items-center w-auto pb-5">
          <div className="flex flex-row items-center gap-5">
            <p className="text-xl h-[50px] w-[50px] text-center p-2 rounded-md border bg-gray-50 shadow-sm">
              {budget?.icon}
            </p>
            <h2 className="text-lg font-semibold">{budget?.budget_name}</h2>
          </div>
        </div>
        <div className="py-5">
          <h3 className="text-md font-semibold text-gray-700">
            Total Amount:{" "}
            <span className="font-normal">
              {userCurrencySymbol}
              {budget?.amount}
            </span>
          </h3>
        </div>
        <div className="w-full">
          <div className="flex flex-row justify-between px-1 items-center mb-2">
            <h2 className="text-xs">
              {userCurrencySymbol}
              {budget?.totalSpend ? budget?.totalSpend : 0.0} Spent
            </h2>
            <h2
              className={`text-xs ${
                budget?.amount - budget?.totalSpend <= 0
                  ? "text-red-500 font-bold"
                  : ""
              }`}
            >
              {userCurrencySymbol}
              {Math.abs(budget?.amount - budget?.totalSpend).toFixed(2)}{" "}
              {budget?.totalSpend > budget?.amount ? "Overspend" : "Remaining"}
            </h2>
          </div>
          <div className="w-full bg-slate-300 h-2 rounded-full">
            <div
              style={{ width: `${percentage}%` }}
              className={`bg-purple-700 h-2 rounded-full`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesByBudgetCard;
