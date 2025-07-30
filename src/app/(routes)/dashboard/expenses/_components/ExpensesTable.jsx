import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Alert from "@/app/_components/Alert";
import { useDatabase } from "@/context/DatabaseContext";

function ExpensesTable({ expenses, userData, refreshData, userCurrencySymbol }) {
  const { deleteExpense } = useDatabase();
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
  const dateFormat = userData.selected_date_format;

  const handleDelete = async (expenseId) => {
    const success = await deleteExpense(expenseId);
    if (success) {
      refreshData();
    }
  };
  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index); // Toggle the expanded row
  };
  const formatDate = (date) => {
    try {
      return format(new Date(date), dateFormat); // Format the date using the preferred format
    } catch {
      return date; // Fallback to raw date if formatting fails
    }
  };
  ;
  return (
    <div>
      <div className="grid grid-cols-9 text-center bg-gray-100 rounded-t-md font-semibold py-1 border-t border-x border-gray-300">
        <p className="col-span-1">Category</p>
        <p className="col-span-1">Amount</p>
        <p className="col-span-5">Description</p>
        <p className="col-span-1">Date</p>
        <p className="col-span-1">Delete</p>
      </div>
      <div className="p-1 bg-gray-100 border-b border-x border-gray-300 rounded-b-md">
        {expenses.map((expense, index) => (
          <React.Fragment key={index}>
            {/* Main Row */}
            <div>
              <div
                className={`grid grid-cols-9 my-1 text-center ${
                  expandedRow === null ? "rounded-md" : "rounded-t-md mb-0"
                } border items-center border-gray-300 bg-gray-50 even:bg-gray-100 cursor-pointer`}
                onClick={() => toggleRow(index)} // Toggles the expanded description row on click
                title="Click to expand"
              >
                <p className="py-1 col-span-1">{expense.category}</p>
                <p className="py-1 col-span-1 w-full">
                  {userCurrencySymbol}
                  {expense.amount}
                </p>
                <p className="py-1 px-2 col-span-5 overflow-hidden text-ellipsis whitespace-nowrap">
                  {expense.description}
                </p>
                <p className="py-1 col-span-1">
                  {formatDate(expense.expense_created_timestamp)}
                </p>
                <p className="py-1 col-span-1 text-red-500">
                  <Alert
                    title="Are you absolutely sure?"
                    description="Deleting an expense will remove the data from the server and cannot be undone."
                    onConfirm={() => handleDelete(expense.id)}
                    onCancel={() => toast("Delete action canceled.")}
                    triggerText={<Trash2 />}
                    variant="ghost"
                  />
                </p>
              </div>
            </div>
            {/* Expanded Row */}
            {expandedRow === index && (
              <div className="bg-gray-100 rounded-b-md border-b border-x border-gray-300">
                <p className="p-3 text-left col-span-10">
                  <strong>Full Description:</strong> {expense.description}
                </p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ExpensesTable;
