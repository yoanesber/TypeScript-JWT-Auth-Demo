import "dotenv/config";
import readline from "readline";

import app from "./app";
import logger from "./utils/logger.util";
import DatabaseConfig from "./config/db.config";

// Connect to the database
try {
    DatabaseConfig.connect();
    logger.info("Database connected successfully");
} catch (error) {
    logger.error(`Error connecting to the database: ${error}`);
    process.exit(1); // Exit if database connection fails
}

// Start the Express server
const PORT = process.env.PORT || 3000;
let server;
try {
    server = app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
    });
} catch (error) {
    logger.error(`Error starting server: ${error}`);
    process.exit(1); // Exit if server fails to start
}

// Handle Ctrl+C on Windows PowerShell
if (process.platform === "win32") {
    try {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.on("SIGINT", () => {
            rl.question("Are you sure you want to exit? (yes/no) ", (answer) => {
                if (answer.toLowerCase() === "yes") {
                    shutdown();
                } else {
                    rl.close();
                }
            });
        });
    } catch (error) {
        logger.error(`Error setting up SIGINT handler: ${error}`);
    }
}

// Graceful shutdown
const shutdown = async () => {
    console.log("\nShutting down gracefully...");

    try {
        // 1. Close database connection
        if (await DatabaseConfig.isConnected()) {
            await DatabaseConfig.disconnect();
            console.log("Database connection closed");
        }

        // 2. Close server
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });

        // 3. Handle any remaining requests
        setTimeout(() => {
            console.error("Forcing shutdown after timeout");
            process.exit(1);
        }, 5000); // 5 seconds timeout
    } catch (err) {
        console.error("Error closing server:", err);
        process.exit(1);
    }
};

// Handle termination signals
process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Heroku or other platforms
