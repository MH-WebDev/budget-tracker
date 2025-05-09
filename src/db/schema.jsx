import { drizzle } from 'drizzle-orm/node-postgres';
import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  index
} from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial().primaryKey(),
  first_name: varchar('first_name', { length: 64 }).notNull(),
  last_name: varchar('last_name', { length: 64 }),
  user_id: varchar('user_id', { length: 255 }).notNull().unique(), // Unique index is automatically created
  email_address: varchar('email_address').notNull().unique(), // Unique index is automatically created
  account_created_timestamp: timestamp('account_created_timestamp').defaultNow().notNull(),
  preferred_currency: varchar('preferred_currency').default('USD').notNull(),
  preferred_currency_symbol: varchar('preferred_currency_symbol').default('$').notNull(),
  selected_date_format: varchar('selected_date_format').default('MM/DD/YYYY').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (users) => ({
  userIdIndex: index('user_id_idx').on(users.user_id), // Index on userId
  emailIndex: index('email_idx').on(users.email_address) // Index on emailAddress
}));

export const budgets = pgTable('budgets', {
  id: serial().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).references(() => users.user_id, { onDelete: 'cascade' }).notNull(),
  budget_name: varchar('budget_name', { length: 30 }).notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar().default('💸'),
  status: varchar('status').default('active').notNull(),
  budget_created_timestamp: timestamp('budget_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (budgets) => ({
  userIdIndex: index('budget_user_id_idx').on(budgets.user_id), // Index on userId
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ] // Checks amount is valid and non-negative
}));

export const expenses = pgTable('expenses', {
  id: serial().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).references(() => users.user_id, { onDelete: 'cascade' }).notNull(), // New user_id column
  amount: numeric('amount').notNull(),
  budget_id: integer().references(() => budgets.id, { onDelete: 'cascade' }).notNull(),
  category: varchar().notNull(),
  icon: varchar().default('💸'),
  description: varchar(),
  expense_created_timestamp: timestamp('expense_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (expenses) => ({
  userIdIndex: index('expense_user_id_idx').on(expenses.user_id), // Index on user_id
  budgetIdIndex: index('expense_budget_id_idx').on(expenses.budget_id), // Index on budget_id
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ]
}));

export const incomes = pgTable('incomes', {
  id: serial().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).references(() => users.user_id, { onDelete: 'cascade' }).notNull(), // New user_id column
  income_name: varchar('income_name', { length: 30 }).notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar().default('💸'),
  comment: varchar(),
  income_created_timestamp: timestamp('income_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (incomes) => ({
  userIdIndex: index('income_user_id_idx').on(incomes.user_id), // Index on userId
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ] // Checks amount is valid and non-negative
}));
