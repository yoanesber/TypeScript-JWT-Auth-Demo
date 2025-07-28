/**
 * TypeScript interface for the refresh token response.
 * It defines the structure of the data returned in a refresh token response.
 */
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expirationAt: Date;
    tokenType: string;
}