import { Trash } from "lucide-react";
import { format } from "date-fns";
import React from "react";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "../../../../../../utils/dbConfig";
import { expenses } from "@/db/schema";

function ExpensesTable({ expensesList, dateFormat, getExpensesList }) {
  const formatDate = (date) => {
    try {
      return format(new Date(date), dateFormat); // Format the date using the preferred format
    } catch {
      return date; // Fallback to raw date if formatting fails
    }
  };
  const deleteExpense = async (expensesList) => {
    if (!confirm("This action cannot be undone. Are you sure you wish to delete?")) return; // Confirm deletion
    const result = await db
      .delete(expenses)
      .where(eq(expenses.id, expensesList.id))
      .returning();

    if (result) {
      getExpensesList(); // Refresh the expenses list after deletion
      toast("Expense deleted successfully");
    }
  };
  return (
    <div>
      <div className="grid grid-cols-10 text-center bg-gray-100 rounded-t-md font-semibold py-1 border-t border-x border-gray-300">
        <p className="col-span-2">Category</p>
        <p className="col-span-2">Amount</p>
        <p className="col-span-3">Comment</p>
        <p className="col-span-2">Date</p>
        <p className="col-span-1">Delete</p>
      </div>
      <div>
        {expensesList.map((expenses, index) => (
          <div
            key={index}
            className="grid grid-cols-10 text-center bg-gray-50 even:bg-gray-100"
          >
            <p className="border-x border-b border-gray-300 py-1 col-span-2">
              {expenses.category}
            </p>
            <p className="border-x border-b border-gray-300 py-1 col-span-2">
              {expenses.amount}
            </p>
            <p className="border-x border-b border-gray-300 py-1 col-span-3">
              {expenses.comment}
            </p>
            <p className="border-x border-b border-gray-300 py-1 col-span-2">
              {formatDate(expenses.createdAt)}
            </p>
            <p className="border-x border-b border-gray-300 py-1 col-span-1 text-red-500">
              <Trash
                className="mx-auto cursor-pointer h-6"
                onClick={() => deleteExpense(expenses)}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpensesTable;
