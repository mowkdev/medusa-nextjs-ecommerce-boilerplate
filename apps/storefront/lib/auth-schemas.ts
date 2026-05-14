import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(80, { message: "Name is too long" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Za-z]/, { message: "Include at least one letter" })
    .regex(/\d/, { message: "Include at least one number" }),
});
export type SignUpValues = z.infer<typeof signUpSchema>;
