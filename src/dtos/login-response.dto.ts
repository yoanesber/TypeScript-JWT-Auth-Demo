/**
 * TypeScript interface for the login response.
 * It defines the structure of the data returned in a login response.
 */
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expirationAt: Date;
    tokenType: string;
}