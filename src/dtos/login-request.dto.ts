import { z } from "zod";

/**
 * Schema for validating login requests.
 * It ensures that the username and password meet specified criteria.
 * - Username must be a string between 3 and 20 characters.
 * - Password must be a string between 6 and 150 characters.
 */
export const LoginRequestSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must not exceed 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(150, "Password must not exceed 150 characters"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
