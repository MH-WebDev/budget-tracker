To-Do List:
===========

## **MAJOR**

BUG: Budget amount is not rounding to 2 decimal places. (BudgetsInfo, possibly)


-- Restart Dashboard
>percentage of total budget spent bar
>percentage of total income spent bar

-- Add category system to CreateIncome and EditIncome

## **SECURITY**


    ## Data Validation/Sanitization
        > Database Anonymizer

    ## Transport Security
        > HTTPS All the things
        > Set HSTS Headers


    ## Other
        > Database backup schedule
        > verify third party services for least-privilige access

## **Minor**

-- Breadcrumbs

-- Create component to hold categories for both expenses and incomes as props to be passed to both create* and filter components

-- Custom date filters?

## **WISHLIST**

    Recurring expenses/incomes

    Debts page --
        -- Debt cards
            -- Total Debt
            -- Period
            -- Interest
            -- Repayment amount
            -- Repayment Button
                -- Amount repaid
                -- Date
            -- Edit Debt
                -- Edit details
                -- Delete Debt

    Add upcoming Expenses
    Include date column with logic to forward-date an expense and move it to expenses table on selected date.

## **COMPLETED**


-- Finalize Styling on each page

-- Complete refactor to bring all scripts into uniform standard - DONE

-- Line chart for all budgets -- Complete
-- Pie chart for income types -- Complete


-- Fix auto-forwarder when no budgets are found -- DONE!

-- Add date created to income card detail view
-- Add overflow text state to income notes column

-- Forwarding after sign up or sign in


>Total Budget
>Total spending
>Total income -- ~ Partial

-- Remove plugins: D3, Mui-X

-- Finalize Navbar expand/shrink icon

-- Fix Navbar scrolling on large pages

-- Filters & Sort Functions
    Filter by:
    >Category
    >Date Range - ~ Partial. (Filter by specified date range?)
    
-- Add filters to ExpensesByBudget

-- Filters & Sort Functions
    Sort by:
    >Date added
    >Amount
    >Category

    ## Security

    
        > Add Validation and sanitization to *all* text inputs. Ensure any malicious code cannot be executed.

        ## Session/Token security
        > httpOnly cookies for session tokens
        > Session expiration and renewal policies
        > CSRF protection for state-changing requests

        
        ## Content Security Policy
        > Strict CSP header to prevent XSS attack

        
        > Ensure proper CORS configuration
        
        
    ## Rate Limiting & Abuse Prevention
        > CAPTCHA for sensitive actions if necessary
        > Rate Limit APIs to prevent brute force

        
    ## Error handling & Logging
        > Prevent exposing stack traces or sensitive error messages to users
        > Log errors securely, avoid logging sensitive data

        
        > Parameterized queries or ORM methods preventing SQL injection

        
        > Prevent user access/modification of other user data (Enforce user ownership on all queries)

        
    ## Authentication/Authorization
        > Ensure sensitive routes and API endpoints require authentication