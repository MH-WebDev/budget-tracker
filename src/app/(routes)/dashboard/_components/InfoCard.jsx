import React, { useEffect, useState } from 'react'
import { format } from "date-fns";

function InfoCard({budgetList, expensesList, user, dateFormat, totalBudget}) {
    console.log(budgetList)

    const preferredCurrency = user?.publicMetadata?.currencySymbol || "$"; // Default to USD if preferred currency  not set

    const budget = budgetList[0] || {totalBudget: 0}; // Fallback to an empty object if budgetList is empty

    const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row

    const formatDate = (date) => {
    try {
        return format(new Date(date), dateFormat); // Format the date using the preferred format
    } catch {
        return date; // Fallback to raw date if formatting fails
    }
    };

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index); // Toggle the expanded row
  };
  return (
    <div>
        <div>
            <div>
                <h2>Total Budgets: {preferredCurrency}{budgetList ? `${totalBudget}` : 'Loading...'}</h2>
            </div>
            <div className="flex flex-row justify-between items-center gap-5">
                <div className="flex flex-col gap-1 w-full">
                    {budgetList.map((budget, index) => {
                        // Calculate percentage dynamically for each budget
                        const percentage =
                        budget.amount > 0
                            ? Math.min((budget.totalSpend / budget.amount) * 100, 100)
                            : 0;

                        return (
                        <div
                            key={budget.id}
                            className="bg-gray-50 even:bg-gray-100 rounded-lg border border-gray-300 p-2 shadow-sm"
                        >
                            <div className="flex flex-row gap-2">
                            <p>{budget.icon}</p>
                            <h2 className="font-semibold">
                                {budgetList ? `${budget.budgetName}` : 'Loading...'}
                            </h2>
                            </div>
                            <div>
                            <h3 className="text-sm font-semibold text-gray-700">
                                Budget Amount:{' '}
                                <span className="font-normal">
                                {preferredCurrency}
                                {budget.amount}
                                </span>
                            </h3>
                            </div>
                            <div className="w-full bg-slate-300 h-2 rounded-full">
                            <div
                                style={{ width: `${percentage}%` }}
                                className={`bg-purple-700 h-2 rounded-full`}
                            ></div>
                            </div>
                        </div>
                        );
                    })}
                </div>
                <div className="flex flex-col border border-gray-300 rounded-lg w-full">
                    Recent Expenses
                    <div>

                    </div>
                </div>
            </div>
            <p>
                Other quick access things
            </p>
            <div className="flex flex-row justify-center items-center border border-gray-300 rounded-lg w-min mx-auto my-5">
                <div className="w-40 py-2 rounded-lg text-center cursor-pointer">Expenses</div>
                <div className="w-40 py-2 rounded-lg text-center bg-purple-700 text-white">Income</div>
            </div>
            {/* EXPENSES TABLE SHOWING ALL EXPENSES ON ACCOUNT */}
            <div className="grid grid-cols-10 text-center bg-gray-100 rounded-t-md font-semibold py-1 border-t border-x border-gray-300">
                <p className="col-span-2">Category</p>
                <p className="col-span-2">Amount</p>
                <p className="col-span-4">Description</p>
                <p className="col-span-2">Date</p>
            </div>
            <div>
                {expensesList.map((expense, index) => (
                   <React.Fragment key={index}>
                   {/* Main Row */}
                   <div
                     className="grid grid-cols-10 text-center bg-gray-50 even:bg-gray-100"
                   >
                     <p className="border-x border-b border-gray-300 py-1 col-span-2">
                       {expense.category}
                     </p>
                     <p className="border-x border-b border-gray-300 py-1 col-span-2">
                       {expense.amount}
                     </p>
                     <p
                       className="border-x border-b border-gray-300 py-1 col-span-4 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                       onClick={() => toggleRow(index)} // Toggle the expanded row on click
                       title="Click to expand"
                     >
                       {expense.description}
                     </p>
                     <p className="border-x border-b border-gray-300 py-1 col-span-2">
                       {formatDate(expense.createdAt)}
                     </p>
                   </div>
                   {/* Expanded Row */}
                   {expandedRow === index && (
                     <div className="bg-gray-50 border-b border-gray-300">
                       <p className="p-3 text-left col-span-10">
                         <strong>Full Description:</strong> {expense.description}
                       </p>
                     </div>
                   )}
                 </React.Fragment>
                ))}
            </div>
        </div>
    </div>
  )
}

export default InfoCard
