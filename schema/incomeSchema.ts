import { z } from "zod";
const dateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg); // Convert string or Date object to Date
    }
    return undefined; // Return undefined if the value is neither a string nor a Date
  },
  z.date().refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
);
export const incomeSchema = z.object({
  source: z.string({ message: "Please enter the source of income" }),
  amount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  currency: z
    .enum(["usd", "pkr", "eur", "inr"], {
      errorMap: () => ({
        message: "Invalid currency. Must be one of: usd, pkr, eur, inr",
      }),
    })
    .default("usd"),
  date: dateSchema.optional(),
});
