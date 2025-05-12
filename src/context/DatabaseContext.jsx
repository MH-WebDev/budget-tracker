'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/utils/dbConfig';
import { user_data, budget_data, expense_data, income_data } from '@/db/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {

  const { user } = useUser();
  const [userData, setUserData] = useState([]);
  const [budgetData, setbudgetData] = useState([]);
  const [expenseData, setexpenseData] = useState([])
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingIncomes, setLoadingIncomes] = useState(false);

  // VERIFY IF USER IS LOGGED IN
  const isUserAvailable = () => {
    if (!user) {
      console.warn('User object is not yet available.');
      return false;
    }
    return true;
  };

  // DATA FETCH FUNCTIONS
  //
  //
  // FETCH USER DATA
  const fetchUserData = async () => {

    if (!isUserAvailable()) return null;

    try {
      setLoadingUser(true); // Set loading state
      const data = await db
        .select()
        .from(user_data)
        .where(eq(user_data.user_id, user.id)); // Query the users table for the logged-in user
      setUserData(data); // Update the userData state
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error); // Log any errors
      return null;
    } finally {
      setLoadingUser(false); // Reset loading state
    }
  };

  // FETCH BUDGETS & EXPENSES - Budgets & Expenses are linked to users via user_id.
  const fetchBudgetExpenseData = async () => {
    if (!user || !user.id) {
      console.warn('User object or ID is not available.');
      return null;
    }
    console.log('Fetching budgets and expenses for user ID:', user.id);

    try {
      setLoadingBudgets(true);
      setLoadingExpenses(true);

      // Ensure user.id is a string
      if (typeof user.id !== 'string') {
        throw new Error(`Invalid user ID: ${user.id}`);
      }

      // Fetch budgets with aggregated expense data
      const budgetsWithAggregates = await db
        .select({
          ...getTableColumns(budget_data),
          amount: sql`${budget_data.amount}`.mapWith(Number),
          totalSpend: sql`SUM(${expense_data.amount})`.mapWith(Number),
          totalItems: sql`COUNT(${expense_data.id})`.mapWith(Number),
        })
        .from(budget_data)
        .leftJoin(expense_data, eq(budget_data.id, expense_data.budget_id))
        .where(eq(budget_data.user_id, user.id))
        .groupBy(budget_data.id)
        .orderBy(desc(budget_data.id));
  
      // Fetch raw expenses
      const expenses = await db
        .select()
        .from(expense_data)
        .where(eq(expense_data.user_id, user.id));
  
      setbudgetData(budgetsWithAggregates); // Update budgets with aggregated data
      setexpenseData(expenses); // Update expenses
  
      console.log('Fetched budgets with aggregates:', budgetsWithAggregates);
      console.log('Fetched expenses:', expenses);
  
      return { budgets: budgetsWithAggregates, expenses };
    } catch (error) {
      console.error('Error fetching budgets and expenses:', error);
      return null;
    } finally {
      setLoadingBudgets(false);
      setLoadingExpenses(false);
    }
  };

  // FETCH BUDGET BY ID # - USED BY EXPENSES/ID 
  const getBudgetById = async (budgetId) => {
    if (!user || !user.id) {
      console.warn("User object or ID is not available.");
      return null;
    }
    try {
      const result = await db
        .select({
          ...getTableColumns(budget_data),
          totalSpend: sql`SUM(${expense_data.amount})`.mapWith(Number), // Sum of expense amounts
          totalItems: sql`COUNT(${expense_data.id})`.mapWith(Number), // Count of expenses
        })
        .from(budget_data)
        .leftJoin(expense_data, eq(budget_data.id, expense_data.budget_id))
        .where(eq(budget_data.user_id, user.id)) // Ensure the budget belongs to the logged-in user
        .where(eq(budget_data.id, budgetId)) // Filter by the specific budget ID
        .groupBy(budget_data.id);
  
      return result[0]; // Return the first (and only) result
    } catch (error) {
      console.error("Error fetching budget by ID:", error);
      return null;
    }
  };

  // FETCH INCOMES - Incomes are linked to users via user_id
  const fetchUserIncomes = async () => {
    if (!user || !user.id) {
      console.warn('User object or ID is not available.');
      return null;
    }

    console.log('Fetching incomes for user ID:', user.id);

    try {
      setLoadingIncomes(true);

      // Ensure user.id is a string
      if (typeof user.id !== 'string') {
        throw new Error(`Invalid user ID: ${user.id}`);
      }

      // Fetch budgets with aggregated expense data
      const incomes = await db
        .select()
        .from(income_data)
        .where(eq(income_data.user_id, user.id))
        .groupBy(income_data.id)
        .orderBy(desc(income_data.id));

      setexpenseData(incomes); // Update expenses

      console.log('Fetched budgets with aggregates:', budgetsWithAggregates);
      console.log('Fetched expenses:', expenses);

      return { budgets: budgetsWithAggregates, expenses };
    } catch (error) {
      console.error('Error fetching budgets and expenses:', error);
      return null;
    } finally {
      setLoadingBudgets(false);
      setLoadingExpenses(false);
    }
  };


  // FUNCTIONS FOR ADDING DATA TO DATABASE
  //
  //

  const addBudget = async (budget) => {

    if (!isUserAvailable()) return null;

    try {
      const newBudget = await db
        .insert(budget_data)
        .values({
          user_id: user.id, // Associate the budget with the logged-in user
          budget_name: budget.name,
          amount: parseFloat(budget.amount), // Ensure the amount is a number
          icon: budget.icon || '🏡', // Default icon if none is provided
          budget_created_timestamp: new Date(), // Optional: Add a timestamp
        })
        .returning(); // Return the inserted budget
      //console.log('Budget added successfully:', newBudget);
      return newBudget;
    } catch (error) {
      console.error('Error adding budget:', error);
      return null;
    }
  };

  const addExpense = async (expenses) => {
    console.warn('addExpense function is not implemented yet.');
  };

  const addIncome = async (incomes) => {
    console.warn('addIncome function is not implemented yet.');
  };

  const deleteBudget = async () => {
    console.warn('deleteBudget function is not implemented yet.');
  };

  const deleteExpense = async () => {
    console.warn('deleteExpense function is not implemented yet.');
  };

  const deleteIncome = async () => {
    console.warn('deleteIncome function is not implemented yet.');
  };
  // FUNCTIONS TO UPDATE DATA IN THE DATABASE
  //
  //
  // UPDATE USER SETTINGS
  const updateUserSettings = async (user_id, settings) => {
    try {
      await db
        .update(user_data)
        .set(settings)
        .where(eq(user_data.user_id, user.id)); // Update the user's settings in the database
      //console.log('User settings updated successfully.');
      await fetchUserData(); // Refresh the user data after the update
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  const updateBudget = async (budget_id, updates) => {
    try {
      const updatedBudget = await db
        .update(budget_data)
        .set({
          ...updates, // Spread the updates (e.g., icon, name, amount)
          updated_at: new Date(), // Explicitly set the updated_at timestamp
        })
        .where(eq(budget_data.id, budget_id)) // Target the specific budget by ID
        .returning(); // Return the updated budget
      console.log('Testing Function');
      await fetchBudgetExpenseData();
        console.log("Budget Successfully Updated", updatedBudget)
    return updatedBudget; // Return the updated budget
  } catch (error) {
    console.error('Error updating budget:', error);
    return null;
  }
  };

  const updateIncome = async () => {
    console.warn('updateIncome function is not implemented yet.');
  };


  // Fetch data when the user logs in
  useEffect(() => {
    if (user) {
      fetchUserData(); // Fetch user data only when the user object is available
      fetchBudgetExpenseData();
      //fetchUserIncomes();
    }
  }, [user]); // Trigger fetchUserData when the user changes

  return (
    <DatabaseContext.Provider
      value={{
        userData,
        budgets: budgetData,
        expenses: expenseData,
        //incomes: incomeData,
        loadingUser,
        loadingBudgets,
        loadingExpenses,
        //loadingIncomes,
        fetchUserData,
        fetchBudgetExpenseData,
        fetchUserIncomes,
        addBudget,
        updateUserSettings,
        updateBudget,
        getBudgetById,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}
// Custom hook to use DatabaseContext
export const useDatabase = () => useContext(DatabaseContext);


