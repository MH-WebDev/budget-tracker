import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, varchar, integer, numeric} from "drizzle-orm/pg-core";

export const budgets = pgTable('budgets', {
  id: serial().primaryKey(),
  budgetName: varchar('budget_name').notNull(),
  amount: numeric().notNull(),
  icon: varchar(),
  createdBy: varchar('created_by').notNull(),
  userFirstName: varchar().notNull(),
  userLastName: varchar().notNull(),
})
export const expenses = pgTable('expenses', {
  id: serial().primaryKey(),
  amount: numeric('amount').notNull(),
  budgetId: integer().references(() => budgets.id),
  category: varchar().notNull(),
  icon: varchar(),
  description: varchar(),
  createdBy: varchar('created_by').notNull(),
  createdAt: varchar('created_at').notNull()
})
export const incomes = pgTable('incomes', {
  id: serial().primaryKey(),
  incomeName: varchar('name').notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar(),
  comment: varchar(),
  createdBy: varchar('created_by').notNull(),
  createdAt: varchar('created_at').notNull()
})
