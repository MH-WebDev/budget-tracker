import { Trash } from "lucide-react";
import { format } from "date-fns";
import React from "react";

function ExpensesTable({ expensesList, dateFormat }) {
  const formatDate = (date) => {
    try {
      return format(new Date(date), dateFormat); // Format the date using the preferred format
    } catch {
      return date; // Fallback to raw date if formatting fails
    }
  };
  return (
    <div>
      <div className="grid grid-cols-5 text-center bg-gray-200 rounded-t-md">
        <p>Category</p>
        <p>Amount</p>
        <p>Comment</p>
        <p>Created</p>
        <p>Delete</p>
      </div>
      <div>
        {expensesList.map((expenses, index) => (
          <div key={index} className="grid grid-cols-5 text-center bg-gray-50">
            <p className="border-x border-b border-gray-300 py-1">
              {expenses.category}
            </p>
            <p className="border-x border-b border-gray-300 py-1">
              {expenses.amount}
            </p>
            <p className="border-x border-b border-gray-300 py-1">
              {expenses.comment}
            </p>
            <p className="border-x border-b border-gray-300 py-1">
              {formatDate(expenses.createdAt)}
            </p>
            <p className="border-x border-b border-gray-300 py-1">
              <Trash className="mx-auto" />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpensesTable;
