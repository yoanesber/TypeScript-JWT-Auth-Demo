import { z } from "zod";

/**
 * Schema for validating note requests.
 * It ensures that the title and content meet specified criteria.
 * - Title must be a string between 1 and 150 characters.
 * - Content must be a string between 1 and 5000 characters.
 */
export const NoteRequestSchema = z.object({
    title: z.string().min(1, "Title is required").max(150, "Title must not exceed 150 characters"),
    content: z.string().min(1, "Content is required").max(5000, "Content must not exceed 5000 characters"),
});

export type NoteRequest = z.infer<typeof NoteRequestSchema>;