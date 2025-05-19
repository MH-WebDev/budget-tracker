import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function IncomeCard({
  incomeInfo,
  userData,
  preferredCurrencySymbol,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5">
      {incomeInfo.map((incomes, index) => (
        <div key={index} className="p-5 border border-gray-300 rounded-md">
          <div className="flex flex-row gap-5 justify-between items-center">
            <div className="flex flex-row gap-5 items-center">
              <p className="text-xl h-[50px] w-[50px] text-center p-2 rounded-md border bg-gray-50 shadow-sm">
                {incomes.icon}
              </p>
              <h1 className="text-lg font-semibold">{incomes.category}</h1>
            </div>
            <div>
              <h2>
                {preferredCurrencySymbol}
                {incomes.amount}
              </h2>
            </div>
          </div>
          <div className="pt-5">
            <h3 className="font-semibold">Notes:</h3>
            <h3>{incomes.comment}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
