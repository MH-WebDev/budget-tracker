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
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name'),
  userId: varchar('user_id').notNull().unique(), // Unique index is automatically created
  emailAddress: varchar('email_address').notNull().unique(), // Unique index is automatically created
  accountCreated: timestamp('account_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (users) => ({
  userIdIndex: index('user_id_idx').on(users.userId), // Index on userId
  emailIndex: index('email_idx').on(users.emailAddress) // Index on emailAddress
}));

export const budgets = pgTable('budgets', {
  id: serial().primaryKey(),
  userId: varchar('user_id').references(() => users.userId, { onDelete: 'cascade' }).notNull(),
  budgetName: varchar('budget_name').notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar().default('💸'),
  status: varchar('status').default('active').notNull(),
  createdAt: timestamp('budget_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (budgets) => ({
  userIdIndex: index('budget_user_id_idx').on(budgets.userId), // Index on userId
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ] // Checks amount is valid and non-negative
}));

export const expenses = pgTable('expenses', {
  id: serial().primaryKey(),
  amount: numeric('amount').notNull(),
  budgetId: integer().references(() => budgets.id, { onDelete: 'cascade' }).notNull(),
  category: varchar().notNull(),
  icon: varchar().default('💸'),
  description: varchar(),
  createdAt: timestamp('expense_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (expenses) => ({
  budgetIdIndex: index('expense_budget_id_idx').on(expenses.budgetId), // Index on budgetId
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ] // Checks amount is valid and non-negative
}));

export const incomes = pgTable('incomes', {
  id: serial().primaryKey(),
  userId: varchar('user_id').references(() => users.userId).notNull(),
  incomeName: varchar('name').notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar().default('💸'),
  comment: varchar(),
  createdAt: timestamp('income_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (incomes) => ({
  userIdIndex: index('income_user_id_idx').on(incomes.userId), // Index on userId
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ] // Checks amount is valid and non-negative
}));
