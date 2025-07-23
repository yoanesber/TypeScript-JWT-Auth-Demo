import { Request, Response } from "express";

import AuthService from "../services/auth.service";
import FormatResponse from "../utils/response.util";
import { LoginRequestSchema } from "../dtos/login-request.dto";
import { RefreshTokenRequestSchema } from "../dtos/refresh-token-request.dto";

class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        // Validate the request body against the LoginRequestSchema
        // This will throw a ZodError if validation fails
        const credentials = LoginRequestSchema.parse(req.body);

        // Call the AuthService to handle the login logic
        // This will throw an error if the login fails for any reason
        const { accessToken, refreshToken, expirationAt, tokenType } = await AuthService.login(credentials);

        res.status(200).json(
            FormatResponse({
                message: "Login successful",
                data: { accessToken, refreshToken, expirationAt, tokenType },
                req,
            })
        );
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        // Validate the request body against the RefreshTokenRequestSchema
        // This will throw a ZodError if validation fails
        const token = RefreshTokenRequestSchema.parse(req.body);

        // Call the AuthService to handle the refresh token logic
        // This will throw an error if the refresh token is invalid or expired
        const { accessToken, refreshToken, expirationAt, tokenType } = await AuthService.refreshToken(token);

        res.status(200).json(
            FormatResponse({
                message: "Refresh token successful",
                data: { accessToken, refreshToken, expirationAt, tokenType },
                req,
            })
        );
    }
}

export default new AuthController();
