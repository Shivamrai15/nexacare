import * as z from "zod";

export const SignUpSchema = z.object({
    role : z.enum(["CUSTOMER", "CAREGIVER"]),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(100, "Password must be at most 100 characters long"),
    name: z.string().min(2, "Name must be at least 2 characters long").max(100, "Name must be at most 100 characters long"),
})