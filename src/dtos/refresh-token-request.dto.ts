import { z } from "zod";

/**
 * Schema for validating refresh token requests.
 * It ensures that the refresh token meets specified criteria.
 * - Refresh token must be a string between 1 and 500 characters.
 */
export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required").max(500, "Refresh token must not exceed 500 characters"),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
