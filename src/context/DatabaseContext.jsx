'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/utils/dbConfig';
import { users, budgets, expenses, incomes } from '@/db/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {

  const { user } = useUser();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH USER DATA
  const fetchUserData = async () => {
    console.log('User object:', user); // Debugging log
    if (!user) {
      console.warn('User object is not yet available. Waiting for user data...');
      return null; // Return early if the user object is not available
    }
    try {
      setLoading(true); // Set loading state
      const data = await db
        .select()
        .from(users)
        .where(eq(users.user_id, user.id)); // Query the users table for the logged-in user
      console.log('Context fetched user data:', data); // Debugging log
      setUserData(data); // Update the userData state
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error); // Log any errors
      return null;
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  // FETCH BUDGETS - Budgets are linked to users via user_id.
  const fetchUserBudgets = useCallback(async () => {
    console.log('User object in fetchUserBudgets:', user); // Debugging log
    if (!user) {
      console.warn('User object is not yet available. Waiting for user data...');
      return null; // Return early if the user object is not available
    }
  
    try {
      setLoading(true); // Set loading state
      const budgetsData = await db
        .select()
        .from(budgets)
        .where(eq(budgets.user_id, user.id)); // Query the budgets table for the logged-in user
      console.log('Fetched user budgets:', budgetsData); // Debugging log
      return budgetsData;
    } catch (error) {
      console.error('Error fetching user budgets:', error); // Log any errors
      return null;
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [user]); // Memoize based on the `user` object


  // FETCH EXPENSES - Budgets are linked to budgets via user_id.
  const fetchUserExpenses = async () => {
    console.log('User object:', user); // Debugging log
    if (!user) {
      console.warn('User object is not yet available. Waiting for user data...');
      return null; // Return early if the user object is not available
    }
  
    try {
      setLoading(true); // Set loading state
      const expensesData = await db
        .select()
        .from(expenses)
        .where(eq(expenses.user_id, user.id)); // Query the expenses table for the logged-in user
      console.log('Fetched user expenses:', expensesData); // Debugging log
      return expensesData;
    } catch (error) {
      console.error('Error fetching user expenses:', error); // Log any errors
      return null;
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  // FETCH INCOMES - Incomes are linked to users via user_id
  const fetchUserIncomes = async () => {
  };


  // UPDATE USER SETTINGS
  const updateUserSettings = async (user_id, settings) => {
    try {
      await db
        .update(users)
        .set(settings)
        .where(eq(users.user_id, user.id)); // Update the user's settings in the database
      console.log('User settings updated successfully.');
      await fetchUserData(); // Refresh the user data after the update
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  const addBudget = async (budget) => {
    console.log('Adding budget:', budget); // Debugging log
    if (!user) {
      console.warn('User object is not yet available. Cannot add budget.');
      return null;
    }

    try {
      const newBudget = await db
        .insert(budgets)
        .values({
          user_id: user.id, // Associate the budget with the logged-in user
          budget_name: budget.name,
          amount: parseFloat(budget.amount), // Ensure the amount is a number
          icon: budget.icon || '🏡', // Default icon if none is provided
          created_at: new Date(), // Optional: Add a timestamp
        })
        .returning(); // Return the inserted budget
      console.log('Budget added successfully:', newBudget);
      return newBudget;
    } catch (error) {
      console.error('Error adding budget:', error);
      return null;
    }
  };

  const addExpense = async (expenses) => {};

  const addIncome = async (incomes) => {};

  const deleteBudget = async () => {};

  const deleteExpense = async () => {};

  const deleteIncome = async () => {};

  const updateBudget = async () => {};

  const updateIncome = async () => {};

  // Fetch data when the user logs in
  useEffect(() => {
    if (user) {
      fetchUserData();// Fetch user data only when the user object is available
      fetchUserBudgets();
      fetchUserExpenses();
    }
  }, [user]); // Trigger fetchUserData when the user changes

  return (
    <DatabaseContext.Provider
      value={{
        userData,
        loading,
        fetchUserData,
        fetchUserBudgets,
        fetchUserExpenses,
        updateUserSettings,
        addBudget,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}
// Custom hook to use DatabaseContext
export const useDatabase = () => useContext(DatabaseContext);