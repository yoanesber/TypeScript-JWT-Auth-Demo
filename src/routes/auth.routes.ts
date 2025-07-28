import Router from 'express';

import AuthController from '../controllers/auth.controller';
import CatchAsync from '../utils/catch-async.util';
import Validate from '../middlewares/validator.middleware';
import { LoginRequestSchema } from '../dtos/login-request.dto';
import { RefreshTokenRequestSchema } from '../dtos/refresh-token-request.dto';


/**
 * Authentication routes for user login and token refresh.
 * This module defines the routes for user authentication,
 * including login and token refresh endpoints.
 * It uses middleware for validation and error handling.
 */
const router = Router();

router.post('/login', Validate(LoginRequestSchema), CatchAsync(AuthController.login));
router.post('/refresh-token', Validate(RefreshTokenRequestSchema), CatchAsync(AuthController.refreshToken));

export default router;
