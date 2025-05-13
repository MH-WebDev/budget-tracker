import React, { useState } from 'react'
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Alert from "@/app/_components/Alert";

function ExpensesTable({ budget, expenses, user, refreshData }) {
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
  const dateFormat = user[0].selected_date_format;
  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index); // Toggle the expanded row
  };
  console.log(user[0].selected_date_format)
  const formatDate = (date) => {
    console.log("Date input", date)
    try {
      return format(new Date(date), dateFormat); // Format the date using the preferred format
    } catch {
      return date; // Fallback to raw date if formatting fails
    }
  };

  return (
    <div>
      <div className="grid grid-cols-10 text-center bg-gray-100 rounded-t-md font-semibold py-1 border-t border-x border-gray-300">
        <p className="col-span-2">Category</p>
        <p className="col-span-2">Amount</p>
        <p className="col-span-3">Description</p>
        <p className="col-span-2">Date</p>
        <p className="col-span-1">Delete</p>
      </div>
      <div>
        {expenses.map((expense, index) => (
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
                className="border-x border-b border-gray-300 py-1 col-span-3 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => toggleRow(index)} // Toggle the expanded row on click
                title="Click to expand"
              >
                {expense.description}
              </p>
              <p className="border-x border-b border-gray-300 py-1 col-span-2">
                {formatDate(expense.expense_created_timestamp)}
              </p>
              <p className="border-x border-b border-gray-300 py-1 col-span-1 text-red-500">
                <Alert
                  title="Are you absolutely sure?"
                  description="Deleting an expense will remove the data from the server and cannot be undone."
                  //onConfirm={() => deleteExpense(expense)}
                  onCancel={() => toast("Delete action canceled.")}
                  triggerText={<Trash2 />}
                  variant="ghost"
                />
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
  )
}

export default ExpensesTable