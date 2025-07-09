## To-Do List:

-- Breadcrumbs
-- Finalize Styling on each page

-- Filters & Sort Functions
    Filter by:
        Category
        Date Range - Partial. (Filter by specified date range?)

    Sort by:
        Date added
        Amount
        Category


-- Restart Dashboard 
    Total income -- Partial
    Total Budget -- Partial
    Total spending
    percentage of total budget spent bar
    percentage of total income spent bar

    Pie chart for expense types

-- Add upcoming Expenses
    Include date column with logic to forward-date an expense and move it to expenses table on selected date.

-- Fix Navbar scrolling on large pages

-- Remove plugins: D3, Mui-X

## SECURITY

    ## Authentication/Authorization
        -- Ensure sensitive routes and API endpoints require authentication
        -- Prevent user access/modification of other user data (Enforce user ownership on all queries)

    ## Data Validation/Sanitization
        -- Add Validation and sanitization to *all* text inputs. Ensure any malicious code cannot be executed.
        -- Database Anonymizer 
        -- Parameterized queries or ORM methods preventing SQL injection

    ## Session/Token security
        -- httpOnly cookies for session tokens
        -- Session expiration and renewal policies
        -- CSRF protection for state-changing requests

    ## Transport Security
        -- HTTPS All the things
        -- Set HSTS Headers

    ## Error handling & Logging
        -- Prevent exposing stack traces or sensitive error messages to users
        -- Log errors securely, avoid logging sensitive data

    ## Dependencies
        -- Audit dependencies
        -- Remove unused packages/plugins

    ## Content Security Policy
        -- Strict CSP header to prevent XSS attack

    ## Rate Limiting & Abuse Prevention
        -- Rate Limit APIs to prevent brute force
        -- CAPTCHA for sensitive actions if necessary

    ## Other
        -- Ensure proper CORS configuration
        -- Database backup schedule
        -- verify third party services for least-privilige access



## WISHLIST

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


## COMPLETED


-- Complete refactor to bring all scripts into uniform standard - DONE

-- Line chart for all budgets -- Complete
-- Pie chart for income types -- Complete


-- Fix auto-forwarder when no budgets are found -- DONE!

-- Add date created to income card detail view
-- Add overflow text state to income notes column

-- Forwarding after sign up or sign in