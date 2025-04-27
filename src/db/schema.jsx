import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const budgets = pgTable('budgets', {
  id: serial().primaryKey(),
  budgetName: varchar('budget_name').notNull(),
  amount: varchar().notNull(),
  icon: varchar(),
  createdBy: varchar('created_by').notNull()
})
export const expenses = pgTable('expenses', {
  id: serial().primaryKey(),
  expenseName: varchar('name').notNull(),
  amount: varchar().notNull(),
  icon: varchar(),
  description: varchar(),
  comment: varchar(),
  createdBy: varchar('created_by').notNull(),
  category: varchar().notNull()
})
export const incomes = pgTable('incomes', {
  id: serial().primaryKey(),
  incomeName: varchar('name').notNull(),
  amount: varchar().notNull(),
  icon: varchar(),
  description: varchar(),
  comment: varchar(),
  createdBy: varchar('created_by').notNull(),
  category: varchar().notNull()
})
