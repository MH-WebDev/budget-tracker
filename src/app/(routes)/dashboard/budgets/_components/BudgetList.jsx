'use client'
import React, { useEffect, useState } from 'react'
import { useDatabase } from "@/context/DatabaseContext";
import BudgetCard from './BudgetCard';
import CreateBudget from './CreateBudget';

function BudgetList( {children} ) {
    const { fetchUserData, fetchUserBudgets, fetchUserExpenses } = useDatabase(); // Access user data and update function from DatabaseProvider
    const [budgets, setBudgets] = useState([]);
    const [user, setUser] = useState();
    const [expenses, setExpenses] = useState([]);

    const refreshBudgets = async () => {
      const budgetInfo = await fetchUserBudgets();
      if (budgetInfo) {
        setBudgets(budgetInfo);
      }
      const userInfo = await fetchUserData();
      if (userInfo) {
        setUser(userInfo[0])
      }
      const expensesInfo = await fetchUserExpenses();
      if (expensesInfo) {
        setExpenses(expensesInfo);
      }
    };

    useEffect(() => {
      refreshBudgets();
       console.log("Refreshing Budgets...")
    }, [fetchUserBudgets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
        {budgets.map((budgets, index) =>(<BudgetCard key={budgets.id} user={user} budgets={budgets} expenses={expenses} index={index} />))} {/* Passing fetched database info to BudgetCard */}
        <CreateBudget onBudgetCreated={refreshBudgets}/>
    </div>
  )
}

export default BudgetList