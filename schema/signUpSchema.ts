import { z } from "zod";

export const signUpSchema = z.object({
  displayName: z
    .string()
    .min(4, { message: "Display name should be a minimum of 4 characters long" }),
  username: z
    .string()
    .min(4, { message: "Username should be a minimum of 4 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Password must be a minimum of 6 characters" }),
  currency: z
    .enum(["usd", "pkr", "eur", "inr"], {
      errorMap: () => ({ message: "Invalid currency. Must be one of: usd, pkr, eur, inr" }),
    })
    .default("usd"), // Set a default value for currency
});
