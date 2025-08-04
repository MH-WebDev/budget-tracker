# **Budget Tracker App**

Medium scale project to put knowledge into practice.

## **Features:**

This project started out watching a Youtube tutorial but quickly grew in scope. Theres a fairly significant wishlist of items i would like to add someday but for now i just need to move on and get some more knowledge into the arsenal.

### **General:**
 > Clerk used for Auth and user management
 > NeonDB Serverless
 > Drizzle Orm

 ### **Dashboard**
   > Displays Info overview of total budgets, expenses, incomes.
   > Data filterable by time period (7,14,30 days or all time)

   #### **Budgets**
   > Displays totals for all budgets, and a bar showing percentage spent of total budget.
   > Individual budget cards can be clicked to view more information, add expenses or modify budget.

   #### **Expenses**
   > dashboard/expenses Displays all expenses in list form, filterable and orderable.
   > dashboard/expenses/id Displays expenses for a particular budget, accessed via budget page.

   #### **Incomes**
   > Displays totals for all income sources, along with statistics for Largest single source category and a chart showing breakdown of incomes.
   > Filterable by date and category.
   > Income cards can be clicked for more information and to edit/remove the entry.

   #### **Settings**
   > Allows the user to select their chosen currency icon and date format.
   > Currency selection does not directly convert to another currency, just displays the proper currency icon as selected.

### **Design**
> Components have been used in as many places as possible to reduce code repetition and make elements easier to update in future. All charts, filtering systems, Alert dialogs and loading icons are universal components.
> All data fetch and manipulation is performed via a context file with functions that are called as high as possible, with user data passed down to sub components as props.

## **WISHLIST**

 ### **Minor**

 > Breadcrumbs
 > Custom date filters?

 > Recurring expenses/incomes
    > Will require a fairly significant rewrite of the app as currently there is no method for setting the date for expenses/income.

 > Debts page
        > Debt cards
            > Total Debt
            > Period
            > Interest
            > Repayment amount
            > Repayment Button
                > Amount repaid
                > Date
            > Edit Debt
                > Edit details
                > Delete Debt

 > Add upcoming Expenses
 > Include date column with logic to forward-date an expense and move it to expenses table on selected date.

 > Goals
    > Savings or spending goals, with due dates and options to automatically deduct from budgets as expenses on set intervals. This will come as part of recurring expenses

