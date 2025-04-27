import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
config({ path: '.env.local' });
console.log('Database URL:', process.env.NEXT_PUBLIC_DATABASE_URL);
export default defineConfig({
  schema: "./src/db/schema.jsx",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});