import { JwtPayload } from "../jwt-payload.interface";

/**
 * Extend the Express Request interface to include the user property.
 */
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}