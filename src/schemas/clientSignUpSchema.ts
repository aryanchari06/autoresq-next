import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username should have minimum 2 letters")
  .max(20, "Username too long")
  .regex(/^[a-zA-Z0-9._-]{2,20}$/, "Invalid usernmae");

export const clientSignUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email ID"
    ),
  fullname: z.string().min(3, "Name too short"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
  phone: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits long" }),
  role: z.enum(["client"]).default("client"),
});
