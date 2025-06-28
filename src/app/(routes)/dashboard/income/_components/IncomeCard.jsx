import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import EditIncome from "./EditIncome";

export default function IncomeCard({
  incomeData,
  userData,
  userCurrencySymbol,
  updateIncome,
  deleteIncome,
  refreshData
}) {
  const user = userData ? userData : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5">
      {incomeData.map((incomes, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="border rounded-md p-5 flex h-[200px] flex-col justify-evenly shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105 text-gray-700">
              <div className="flex flex-row justify-between items-center w-auto">
                <div className="flex flex-row items-center gap-5">
                  <p className="text-xl h-[50px] w-[50px] text-center p-2 rounded-md border bg-gray-50 shadow-sm">
                    {incomes?.icon}
                  </p>
                  <h2 className="text-lg font-semibold">{incomes?.category}</h2>
                </div>
              </div>
              <div className="py-5">
                <h3 className="text-md font-semibold text-gray-700">
                  Total Amount:{" "}
                  <span className="font-normal">
                    {userCurrencySymbol}
                    {incomes?.amount}
                  </span>
                </h3>
                <h3 className="text-md font-semibold text-gray-700">
                    Date Created:
                    <span className="pl-3 font-normal">
                      {format(new Date(incomes.income_created_timestamp),
                      userData?.selected_date_format || "MM/dd/yyyy")}
                    </span>
                  </h3>
              </div>
              <div className=" flex flex-row gap-5 items-center">
                <h3 className="font-semibold">Notes:</h3>
                <h3 className="truncate">{incomes?.comment}</h3>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex gap-10 items-center">
                <span className="text-2xl flex justify-center items-center border border-gray-300 rounded-md w-12 h-12">
                  {incomes?.icon}
                </span>
                <span className="text-left">{incomes?.category}</span>
              </DialogTitle>
              <div className="flex gap-10 justify-between py-5">
                <div>
                  <p className="text-left ">
                    Income Amount:
                    <span className=" pl-3 font-semibold">
                      {userCurrencySymbol}
                      {incomes?.amount}
                    </span>
                  </p>
                </div>
                <div>
                  <h3>
                    Date Created:
                    <span className=" pl-3 font-semibold">
                      {format(new Date(incomes.income_created_timestamp),
                      userData?.selected_date_format || "MM/dd/yyyy")}
                    </span>
                  </h3>
                  <h3
                    className={`${
                      Math.floor(new Date(incomes.updated_at).getTime() / 1000) >
                      Math.floor(new Date(incomes.income_created_timestamp).getTime() / 1000)
                        ? "inline-block"
                        : "hidden"
                    }`}
                  >
                    Last Updated:
                    <span className="pl-3 font-semibold">
                      {format(
                        new Date(incomes.updated_at),
                        userData?.selected_date_format || "MM/dd/yyyy"
                      )}
                    </span>
                  </h3>
                </div>
              </div>
              <div className="pt-5 flex flex-row gap-5 items-center">
                <h3 className="font-semibold">Notes:</h3>
                <h3 className="wrap">{incomes?.comment}</h3>
              </div>
              <div className="flex items-center justify-center gap-5">
                <EditIncome
                income={incomes}
                userDate={userData}
                updateIncome={updateIncome}
                refreshData={refreshData}
                deleteIncome={deleteIncome}
              />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
