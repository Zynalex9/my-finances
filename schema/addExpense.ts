import { z } from "zod";

export const expenseSchema = z.object({
  budgetId: z.string().min(1, "Budget ID is required"), // Ensures the string has at least one character
  category: z.string(), // Ensures the string has at least one character
  amount: z
  .string()
  .refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Please enter a valid number",
  }),
currency: z
  .enum(["usd", "pkr", "eur", "inr"], {
    errorMap: () => ({ message: "Invalid currency. Must be one of: usd, pkr, eur, inr" }),
  })
  .default("usd"),
  description: z.string().optional(), // Optional string field
  spendingDate: z.date(), // Date validation
});
