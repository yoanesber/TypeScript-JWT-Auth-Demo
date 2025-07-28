import { ValidationError, ValidationErrorItem, DatabaseError } from 'sequelize';

import AppError from "../exceptions/app-error.exception";
import User from "../models/user.model";


/**
 * UserService handles operations related to user management.
 * It provides methods to update user information such as last login time.
 * It uses Sequelize for database operations.
 */
class UserService {
    async updateLastLogin(userId: number): Promise<boolean> {
        // Validate the userId
        if (!userId) throw AppError.BadRequest("Invalid user ID", "User ID is required to create a refresh token");
        
        try {
            // Update the last login time
            const [affectedCount] = await User.update(
                { 
                    lastLogin: new Date(),
                    updatedBy: userId, // Assuming the userId is the one updating
                 },
                {
                    where: { id: userId },
                    // returning: true, // Return the updated rows
                    // individualHooks: true, // Use hooks if defined
                }
            );

            if (affectedCount === 0) {
                throw AppError.NotFound("User not found", "No user found with the provided ID");
            }

            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }
            if (error instanceof ValidationError) {
                const messages = error.errors.map((e: ValidationErrorItem) => e.message);
                throw AppError.BadRequest("Validation errors occurred", messages);
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while updating last login due to: ${error.message}`);
            }

            throw AppError.InternalServerError("Failed to update last login", `An unexpected error occurred while updating last login for user ID ${userId} due to: ${error}`);
        }
    }
}

export default new UserService();
