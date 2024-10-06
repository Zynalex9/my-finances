import { z } from "zod";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    return new Date(arg); // Convert string or Date object to Date
  }
  return undefined; // Return undefined if the value is neither a string nor a Date
}, z.date().refine((date) => !isNaN(date.getTime()), { message: "Invalid date" }));

export const budgetSchema = z
  .object({
    category: z.string().min(1, { message: "Category is required" }), 
    amount: z
      .string()
      .refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string",
      }),
    currency: z
      .enum(["usd", "pkr", "eur", "inr"], {
        errorMap: () => ({ message: "Invalid currency. Must be one of: usd, pkr, eur, inr" }),
      })
      .default("usd"),
    startDate: dateSchema.refine((date) => date <= new Date(), {
      message: "Start Date cannot be in the future",
    }),
    endDate: dateSchema.refine((date) => date >= new Date(), {
      message: "End Date cannot be in the past",
    }),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End Date cannot be before Start Date",
        path: ["endDate"],
      });
    }
  });
