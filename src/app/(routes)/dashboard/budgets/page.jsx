"use client";
import React, { useState, useEffect } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import BudgetCard from "./_components/BudgetCard";
import Loading from "@/app/_components/Loading";
import { useUser } from "@clerk/nextjs";
import CreateBudget from "./_components/CreateBudget";
import BudgetsInfo from "./_components/BudgetsInfo";

export default function page() {
  const { user } = useUser();
  const {
    budgets,
    expenses,
    userData,
    fetchBudgetExpenseData,
    updateBudget,
    deleteBudget,
  } = useDatabase(); // Access data and fetch function from DatabaseProvider
  const [loading, setLoading] = useState(true); // Loading state

  // Refresh budgets and expenses
  // Fetch budgets and expenses and manage loading state
  const refreshBudgetsAndExpenses = async () => {
    setLoading(true);
    try {
      await fetchBudgetExpenseData();
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (user) {
      refreshBudgetsAndExpenses();
    }
  }, [userData, user]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="p-5">
      <h2>Budgets:</h2>
      <div  className="grid grid-cols-1 md:grid-cols-2 py-5 gap-5">
        <BudgetsInfo budget={budgets} userData={userData} className="order-last"/>
        <CreateBudget  onBudgetCreated={refreshBudgetsAndExpenses}/>
      </div>
      <hr className="pb-5"/>
      <div>
        <BudgetCard
          userData={userData} // Pass the first user object
          budget={budgets} // Pass the current budget
          expenses={expenses} // Filter expenses by budget ID
          refreshData={refreshBudgetsAndExpenses}
          updateBudget={updateBudget}
          deleteBudget={deleteBudget}
        />
      </div>
    </div>
  );
}


