import { drizzle } from 'drizzle-orm/node-postgres';
import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  index,
  columns
} from "drizzle-orm/pg-core";

export const user_data = pgTable('user_data', {
  id: serial().primaryKey(),
  first_name: varchar('first_name', { length: 64 }).notNull(),
  last_name: varchar('last_name', { length: 64 }),
  user_id: varchar('user_id', { length: 255 }).notNull().unique(),
  email_address: varchar('email_address').notNull().unique(),
  account_created_timestamp: timestamp('account_created_timestamp').defaultNow().notNull(),
  preferred_currency: varchar('preferred_currency').default('USD').notNull(),
  preferred_currency_symbol: varchar('preferred_currency_symbol').default('$').notNull(),
  selected_date_format: varchar('selected_date_format').default('MM/DD/YYYY').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (columns) => ({
  userIdIndex: index('user_id_idx').on(columns.user_id), // Use columns parameter
  emailIndex: index('email_idx').on(columns.email_address) // Use columns parameter
}));

export const budget_data = pgTable('budget_data', {
  id: serial().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).references(() => user_data.user_id, { onDelete: 'cascade' }).notNull(),
  budget_name: varchar('budget_name', { length: 30 }).notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar().default('💸'),
  status: varchar('status').default('active').notNull(),
  budget_created_timestamp: timestamp('budget_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (columns) => ({
  userIdIndex: index('budget_user_id_idx').on(columns.user_id), // Use columns parameter
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ]
}));

export const expense_data = pgTable('expense_data', {
  id: serial().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).references(() => user_data.user_id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount').notNull(),
  budget_id: integer().references(() => budget_data.id, { onDelete: 'cascade' }).notNull(),
  category: varchar().notNull(),
  icon: varchar().default('💸'),
  description: varchar(),
  expense_created_timestamp: timestamp('expense_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (columns) => ({
  userIdIndex: index('expense_user_id_idx').on(columns.user_id), // Use columns parameter
  budgetIdIndex: index('expense_budget_id_idx').on(columns.budget_id), // Use columns parameter
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ]
}));

export const income_data = pgTable('income_data', {
  id: serial().primaryKey(),
  user_id: varchar('user_id', { length: 255 }).references(() => user_data.user_id, { onDelete: 'cascade' }).notNull(),
  income_name: varchar('income_name', { length: 30 }).notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar().default('💸'),
  comment: varchar(),
  income_created_timestamp: timestamp('income_created_timestamp').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (columns) => ({
  userIdIndex: index('income_user_id_idx').on(columns.user_id), // Use columns parameter
  checks: [
    `amount >= 0` // Table-level CHECK constraint for amount
  ]
}));