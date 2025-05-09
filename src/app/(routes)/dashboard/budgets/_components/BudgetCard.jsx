import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
//import EditBudget from "./EditBudget";

function BudgetCard({ budgets, user, expenses }) {
    const [ percentage, setPercentage ] = useState(0);

    // useEffect(() => {
    //     if (budgets.amount > 0) {
    //         const calculatedPercentage = ((budgets.totalSpent / budgets.amount) * 100).toFixed(0);
    //         setPercentage(calculatedPercentage);
    //     }
    // }, [budgets.amount, budgets.totalSpend]);

  console.log("User Info", user);
  console.log("expenses info", expenses)

  // PULL USER EXPENSES DATA MATCHING CURRENT BUDGET ID & SET RESULT TO TOTALSPENT, SET NUMBER OF EXPENSES TO TOTALITEMS.

  const preferredCurrencySymbol = user?.preferred_currency_symbol || " ";
  return (
  <Dialog>
  <DialogTrigger asChild>
    <div className="border rounded-md p-5 flex h-[200px] flex-col justify-evenly shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105 text-gray-700">
      <div className="flex flex-row justify-between items-center w-auto">
        <div className="flex flex-row items-center gap-5">
          <p className="text-xl h-[50px] w-[50px] text-center p-2 rounded-md border bg-gray-50 shadow-sm">
            {budgets?.icon}
          </p>
          <h2 className="text-lg font-semibold">{budgets.budget_name}</h2>
        </div>
      </div>
      <div className="py-5">
        <h3 className="text-md font-semibold text-gray-700">
          Total Amount:{" "}
          <span className="font-normal">
            {preferredCurrencySymbol}
            {budgets.amount}
          </span>
        </h3>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between px-1 items-center mb-2">
          <h2 className="text-xs">
            ${budgets.totalSpend ? budgets.totalSpend : 0} Spent
          </h2>
          <h2 className={`text-xs ${(budgets.amount - budgets.totalSpend) <= 0 ? "text-red-500 font-bold" : ""}`}>
            ${(budgets.amount - budgets.totalSpend).toFixed(2)} Remaining
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
          {budgets.icon}
        </span>
        <span className="text-left">{budgets.budgetName}</span>
      </DialogTitle>
      <div className="flex gap-10 justify-between py-5">
        <div>
          <p className="text-left ">
            Starting Budget:
            <span className=" pl-3 font-semibold">
              {preferredCurrencySymbol}
              {budgets.amount}
            </span>
          </p>
        </div>
        <div>
          <h3>
            Transaction Count:{" "}
            <span className=" pl-3 font-semibold">{budgets.totalItems}</span>
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
            ${budgets.totalSpend ? budgets.totalSpend : 0} Spent
          </h2>
          <h2 className="text-xs">
            ${budgets.amount - budgets.totalSpend} Remaining
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
        <Link className="w-full" href={"/dashboard/expenses/" + budgets?.id}>
          <Button className="bg-gray-700 w-full">View Expenses</Button>
        </Link>
      </div>
      <div className="flex items-center justify-center gap-5">
        {/* <EditBudget budgets={budgets} refreshData={refreshData} /> */}
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
);
}

export default BudgetCard