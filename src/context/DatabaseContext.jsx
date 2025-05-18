"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "@/utils/dbConfig";
import { user_data, budget_data, expense_data, income_data } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { format } from "date-fns";
import { toast } from "sonner";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const { user } = useUser();
  const [userData, setUserData] = useState([]);
  const [budgetData, setbudgetData] = useState([]);
  const [expenseData, setexpenseData] = useState([]);
  const [incomeData, setincomeData] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingIncomes, setLoadingIncomes] = useState(false);

  // VERIFY IF USER IS LOGGED IN
  const isUserAvailable = () => {
    if (!user) {
      console.warn("User object is not yet available.");
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
      console.error("Error fetching user data:", error); // Log any errors
      return null;
    } finally {
      setLoadingUser(false); // Reset loading state
    }
  };

  // FETCH BUDGETS & EXPENSES - Budgets & Expenses are linked to users via user_id.
  const fetchBudgetExpenseData = async () => {
    if (!user || !user.id) {
      console.warn("User object or ID is not available.");
      setLoadingBudgets(false);
      setLoadingExpenses(false);
      return null;
    }

    try {
      setLoadingBudgets(true);
      setLoadingExpenses(true);

      // Ensure user.id is a string
      if (typeof user.id !== "string") {
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

      return { budgets: budgetsWithAggregates, expenses };
    } catch (error) {
      console.error("Error fetching budgets and expenses:", error);
      return null;
    } finally {
      setLoadingBudgets(false);
      setLoadingExpenses(false);
    }
  };

  // FETCH BUDGET BY ID # - USED BY EXPENSES/ID PAGE
  const fetchBudgetExpenseDataById = async (budgetId, userDateFormat) => {
    if (!user || !user.id) {
      console.warn("User object or ID is not available.");
      setLoadingBudgets(false);
      setLoadingExpenses(false);
      return null;
    }
    try {
      setLoadingBudgets(true);
      setLoadingExpenses(true);

      if (typeof user.id !== "string") {
        throw new Error(`Invalid user ID: ${user.id}`);
      }

      const expensesByBudgetId = await db
        .select({
          ...getTableColumns(budget_data),
          amount: sql`${budget_data.amount}`.mapWith(Number),
          totalSpend: sql`SUM(${expense_data.amount})`.mapWith(Number),
          totalItems: sql`COUNT(${expense_data.id})`.mapWith(Number),
        })
        .from(budget_data)
        .leftJoin(expense_data, eq(budget_data.id, expense_data.budget_id))
        .where(eq(budget_data.user_id, user.id)) // Ensure the budget belongs to the logged-in user
        .where(eq(budget_data.id, budgetId)) // Filter by the specific budget ID of current page via params
        .groupBy(budget_data.id);

      // Fetch raw expenses
      const expenses = await db
        .select()
        .from(expense_data)
        .where(eq(expense_data.budget_id, budgetId));

      // Formatting of expenses date for display
      const formattedExpenses = expenses.map((expense) => ({
        ...expense,
        expense_created_timestamp: format(
          new Date(expense.expense_created_timestamp),
          userDateFormat || "MM/dd/yyyy" // Defaults to this format if userDateFormat is not provided
        ),
      }));

      setbudgetData(expensesByBudgetId[0]); // Update budgets with aggregated data
      setexpenseData(formattedExpenses); // Update expenses

      return { budgets: expensesByBudgetId[0], expenses: formattedExpenses };
    } catch (error) {
      console.error("Error fetching budget and expenses:", error);
      throw new Error("Failed to fetch budget and expenses.");
    } finally {
      setLoadingBudgets(false);
      setLoadingExpenses(false);
    }
  };

  // FETCH INCOMES - Incomes are linked to users via user_id
  const fetchUserIncomes = async () => {
    if (!user || !user.id) {
      console.warn("User object or ID is not available.");
      return null;
    }

    try {
      setLoadingIncomes(true);

      // Ensure user.id is a string
      if (typeof user.id !== "string") {
        throw new Error(`Invalid user ID: ${user.id}`);
      }

      // Fetch budgets with aggregated expense data
      const incomes = await db
        .select()
        .from(income_data)
        .where(eq(income_data.user_id, user.id))
        .groupBy(income_data.id)
        .orderBy(desc(income_data.id));

      setincomeData(incomes); // Update expenses

      return incomes;
    } catch (error) {
      console.error("Error fetching incomes:", error);
      return null;
    } finally {
      setLoadingIncomes(false);
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
          icon: budget.icon || "🏡", // Default icon if none is provided
          budget_created_timestamp: new Date(), // Optional: Add a timestamp
        })
        .returning(); // Return the inserted budget
      return newBudget;
    } catch (error) {
      console.error("Error adding budget:", error);
      return null;
    }
  };

  const addExpense = async (expense) => {
    if (!isUserAvailable()) return null;

    try {
      const { amount, budget_id, category, icon, description } = expense;
      const newExpense = await db
        .insert(expense_data)
        .values({
          user_id: user.id,
          amount: parseFloat(expense.amount),
          budget_id,
          category,
          icon,
          description,
        })
        .returning(); // Return the inserted income
      return newExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      return null;
    }
  };

  const addIncome = async (income) => {
    if (!isUserAvailable()) return null;

    try {
      const newIncome = await db
        .insert(income_data)
        .values({
          user_id: user.id, // Associate the income with the logged-in user
          category: income.category,
          comment: income.comment,
          amount: parseFloat(income.amount), // Ensure the amount is a number
          icon: income.icon || "🏡", // Default icon if none is provided
          income_created_timestamp: new Date(), // Add a timestamp
        })
        .returning(); // Return the inserted income
      return newIncome;
    } catch (error) {
      console.error("Error adding income:", error);
      return null;
    }
  };

  // FUNCTIONS REMOVING DATA FROM DB
  //
  //
  const deleteBudget = async (butgetId) => {
    try {
      const result = await db
        .delete(budget_data)
        .where(eq(budget_data.id, butgetId))
        .returning();

      if (result) {
        toast("Budget successfully deleted");
        return true;
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast("An error occured");
      return false;
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      const result = await db
        .delete(expense_data)
        .where(eq(expense_data.id, expenseId))
        .returning();

      if (result) {
        toast("Expense successfully deleted");
        return true;
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast("An error occured");
      return false;
    }
  };

  const deleteIncome = async (incomeId) => {
    try {
      const result = await db
      .delete(income_data)
      .where(eq(income_data.id, incomeId))
      .returning();

      if (result) {
        toast("Income successfully deleted");
        return true;
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast("An error occured, please try again later or contact support if this problem persists");
      return false;
    }
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
      await fetchUserData(); // Refresh the user data after the update
    } catch (error) {
      console.error("Error updating user settings:", error);
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
      await fetchBudgetExpenseData();
      return updatedBudget; // Return the updated budget
    } catch (error) {
      console.error("Error updating budget:", error);
      return null;
    }
  };

  const updateIncome = async (income_id, updates) => {
    try {
      const updatedIncome = await db
        .update(income_data)
        .set({
          ...updates, // Spread the updates (e.g., icon, name, amount)
          updated_at: new Date(), // Explicitly set the updated_at timestamp
        })
        .where(eq(income_data.id, income_id)) // Target the specific budget by ID
        .returning(); // Return the updated budget
      await fetchBudgetExpenseData();
      return updatedIncome; // Return the updated budget
    } catch (error) {
      console.error("Error updating income:", error);
      return null;
    }
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
        incomes: incomeData,
        loadingUser,
        loadingBudgets,
        loadingExpenses,
        loadingIncomes,
        fetchUserData,
        fetchBudgetExpenseData,
        fetchBudgetExpenseDataById,
        fetchUserIncomes,
        addBudget,
        addExpense,
        addIncome,
        updateUserSettings,
        updateBudget,
        updateIncome,
        deleteBudget,
        deleteExpense,
        deleteIncome,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
// Custom hook to use DatabaseContext
export const useDatabase = () => useContext(DatabaseContext);
