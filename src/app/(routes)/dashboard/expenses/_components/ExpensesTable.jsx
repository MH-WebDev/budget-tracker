import React, { useState } from "react";
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowUp, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Alert from "@/app/_components/Alert";
import { useDatabase } from "@/context/DatabaseContext";

function ExpensesTable({ expenses, userData, refreshData, userCurrencySymbol }) {
  const { deleteExpense } = useDatabase();
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
  const [sortBy, setSortBy] = useState("date"); // Sorting logic state, defaults to sort by date
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"
  const dateFormat = userData.selected_date_format;
  console.log(expenses[0].expense_created_timestamp)
  console.log(new Date(expenses.expense_created_timestamp))

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
  const handleSort = (column) => { // Function to handle sorting of data within table
    // If the column is already sorted, toggle the direction
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  function parseDDMMYYYY(dateStr) { // Function to parse date in dd/MM/yyyy format
    if (!dateStr) return new Date(""); // fallback
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  const sortedExpenses = [...expenses].sort((a, b) => { // Sorting logic based on selected column and direction
  let aValue, bValue;
  if (sortBy === "category") {
    aValue = a.category?.toLowerCase() ?? "";
    bValue = b.category?.toLowerCase() ?? "";
  } else if (sortBy === "amount") {
    aValue = parseFloat(a.amount) || 0;
    bValue = parseFloat(b.amount) || 0;
  } else if (sortBy === "date") {
    let aDate = expenseDateToObject(a.expense_created_timestamp);
    let bDate = expenseDateToObject(b.expense_created_timestamp);
    aValue = aDate.getTime();
    bValue = bDate.getTime();
  }
  function expenseDateToObject(dateStr) {
    // Try ISO first
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) return isoDate;
    // Try dd/MM/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return parseDDMMYYYY(dateStr);
    return new Date(""); // fallback
  }
  if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
  if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
  return 0;
});
  return (
    <div>
      <div className="grid grid-cols-9 text-center bg-gray-100 rounded-t-md font-semibold py-1 border-t border-x border-gray-300">
        <div className="col-span-1 cursor-pointer flex flex-row items-center gap-1 justify-center" onClick={() => handleSort("category")}>
          <p>Category</p>
          <div>
            {sortBy === "category" ? (sortDirection === "asc" ? <ChevronDown size={20} /> : <ChevronUp size={20} />) : ""}
          </div>
        </div>
        <div className="col-span-1 cursor-pointer flex flex-row items-center gap-1 justify-center" onClick={() => handleSort("amount")}>
          <p>Amount</p>
          <div>
            {sortBy === "amount" ? (sortDirection === "asc" ? <ChevronDown size={20} /> : <ChevronUp size={20} />) : ""}
          </div>
        </div>
        <p className="col-span-5">Description</p>
        <div className="col-span-1 cursor-pointer flex flex-row items-center gap-1 justify-center" onClick={() => handleSort("date")}>
          <p>
            Date
          </p>
          <div>
             {sortBy === "date" ? (sortDirection === "asc" ? <ChevronDown size={20} /> : <ChevronUp size={20} />) : ""}
          </div>
        </div>
        <p className="col-span-1">Delete</p>
      </div>
      <div className="p-1 bg-gray-100 border-b border-x border-gray-300 rounded-b-md">
        {sortedExpenses.map((expense, index) => (
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
