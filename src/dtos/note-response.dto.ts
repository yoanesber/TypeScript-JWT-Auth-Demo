/**
 * TypeScript interface for the note response.
 * It defines the structure of the data returned in a note response.
 */
export interface NoteResponse {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}