"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useDatabase } from "@/context/DatabaseContext";
import ExpensesTable from "./_components/ExpensesTable";
import Loading from "@/app/_components/Loading";

function page() {
  const { user } = useUser();
  const { fetchBudgetExpenseData, userData, addExpense } = useDatabase();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expenseInfo, setExpenseInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [userData, user]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      //Fetching budget and expense data
      const data = await fetchBudgetExpenseData(
        userData?.selected_date_format || "MM/dd/yyyy"
      );
      if (data) {
        setBudgetInfo(data.budgets);
        setExpenseInfo(data.expenses);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="p-5">
        <h2 className="text-xl p-5 font-semibold">Expenses</h2>
        <ExpensesTable
          budget={budgetInfo}
          expenses={expenseInfo}
          userData={userData}
          refreshData={fetchAllData} // Pass the function to refresh the list
        />
      </div>
    </>
  );
}

export default page;
