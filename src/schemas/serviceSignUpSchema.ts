import { z } from "zod";
import { usernameValidation } from "./clientSignUpSchema";


export const serviceSignUpSchema = z.object({
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
  rating: z.number().default(0),
  role: z.enum(["service"]).default("service"),
  enterpriseName: z.string().max(30, "Enterprise name too long"),
  enterpriseAddress: z.string().max(300, "Enterprise address too long"),
});
