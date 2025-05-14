import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditBudget from "./EditBudget";

function BudgetCard({ budget, user, expenses, refreshBudgetsAndExpenses, updateBudget, deleteBudget, refreshData }) {
    const [ percentage, setPercentage ] = useState(0);

     useEffect(() => {
         if (budget.amount > 0) {
             const calculatedPercentage = ((budget.totalSpend / budget.amount) * 100).toFixed(0);
             setPercentage(Math.min(calculatedPercentage, 100));
         }
     }, [budget.amount, budget.totalSpend]);

  const preferredCurrencySymbol = user?.preferred_currency_symbol || " ";

  return (
  <Dialog>
  <DialogTrigger asChild>
    <div className="border rounded-md p-5 flex h-[200px] flex-col justify-evenly shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105 text-gray-700">
      <div className="flex flex-row justify-between items-center w-auto">
        <div className="flex flex-row items-center gap-5">
          <p className="text-xl h-[50px] w-[50px] text-center p-2 rounded-md border bg-gray-50 shadow-sm">
            {budget?.icon}
          </p>
          <h2 className="text-lg font-semibold">{budget.budget_name}</h2>
        </div>
      </div>
      <div className="py-5">
        <h3 className="text-md font-semibold text-gray-700">
          Total Amount:{" "}
          <span className="font-normal">
            {preferredCurrencySymbol}
            {budget.amount}
          </span>
        </h3>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between px-1 items-center mb-2">
          <h2 className="text-xs">
            {preferredCurrencySymbol}{budget.totalSpend ? budget.totalSpend : 0} Spent
          </h2>
          <h2 className={`text-xs ${(budget.amount - budget.totalSpend) <= 0 ? "text-red-500 font-bold" : ""}`}>
            {preferredCurrencySymbol}{Math.abs(budget.amount - budget.totalSpend).toFixed(2)} {budget.totalSpend > budget.amount ? "Overspend" : "Remaining"}
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
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="flex gap-10 items-center">
        <span className="text-2xl flex justify-center items-center border border-gray-300 rounded-md w-12 h-12">
          {budget.icon}
        </span>
        <span className="text-left">{budget.budget_name}</span>
      </DialogTitle>
      <div className="flex gap-10 justify-between py-5">
        <div>
          <p className="text-left ">
            Starting Budget:
            <span className=" pl-3 font-semibold">
              {preferredCurrencySymbol}
              {budget.amount}
            </span>
          </p>
        </div>
        <div>
          <h3>
            Transaction Count:
            <span className=" pl-3 font-semibold">{budget.totalItems}</span>
          </h3>
          <h4>
            Created By:{" "}
            <span className=" pl-3 font-semibold">
              {user ? `${user.first_name}` : "Loading..."}
            </span>
          </h4>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between px-1 items-center mb-2">
          <h2 className="text-xs">
            {preferredCurrencySymbol}{budget.totalSpend} Spent
          </h2>
          <h2 className={`text-xs ${(budget.amount - budget.totalSpend) <= 0 ? "text-red-500 font-bold" : ""}`}>
            {preferredCurrencySymbol}{Math.abs(budget.amount - budget.totalSpend).toFixed(2)} {budget.totalSpend > budget.amount ? "Overspend" : "Remaining"}
          </h2>
        </div>
        <div className="w-full bg-slate-300 h-2 rounded-full">
          <div
            style={{ width: `${percentage}%` }}
            className={`bg-purple-700 h-2 rounded-full`}
          ></div>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-center gap-5">
        <Link className="w-full" href={"/dashboard/expenses/" + budget?.id}>
          <Button className="bg-gray-700 w-full">View Expenses</Button>
        </Link>
      </div>
      <div className="flex items-center justify-center gap-5">
        <EditBudget 
          budget={budget}
          updateBudget={updateBudget}
          refreshData={refreshData}
          deleteBudget={deleteBudget} />
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
);
}

export default BudgetCard