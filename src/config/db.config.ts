import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';
import { Dialect, Transaction } from 'sequelize';

import Logger from "../utils/logger.util";
import Note from '../models/notes.model';
import RefreshToken from '../models/refresh-token.model';
import Role from '../models/role.model';
import User from '../models/user.model';
import UserRole from '../models/user-role.model';

/**
 * Database configuration class.
 * This class handles the connection to the database using Sequelize.
 * It provides methods to connect, disconnect, and manage transactions.
 * It also allows access to the Sequelize instance and checks the connection status.
 */
class DatabaseConfig {
    private sequelize: Sequelize;
    private env: string;
    private dbHost: string;
    private dbPort: number;
    private dbName: string;
    private dbUser: string;
    private dbPass: string | undefined;
    private dialect: Dialect;
    private connected: boolean = false;
    private transaction: Transaction | null = null;

    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        this.dbHost = process.env.DB_HOST || 'localhost';
        this.dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
        this.dbName = process.env.DB_NAME as string;
        this.dbUser = process.env.DB_USER as string;
        this.dbPass = process.env.DB_PASS;
        this.dialect = (process.env.DB_DIALECT as Dialect) || 'postgres';

        this.sequelize = new Sequelize({
            database: this.dbName,
            username: this.dbUser,
            password: this.dbPass || '',
            host: this.dbHost,
            port: this.dbPort,
            dialect: this.dialect,
            // logging: this.env !== 'production' ? console.log : false, // Set to true for debugging
            logging: this.env !== 'production' ? false : false, // Set to true for debugging
            models: [User, Role, UserRole, RefreshToken, Note], // Register models
        });
    }

    public async getSequelizeInstance(): Promise<Sequelize> {
        return this.sequelize;
    }

    public async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.connected = true;
            Logger.info(`Database connected (${this.env})`);
        } catch (error) {
            Logger.error(`Unable to connect to the database: ${error}`);
            this.connected = false;
            throw error; // Rethrow to handle it in the caller
        }
    }

    public async isConnected(): Promise<boolean> {
        return this.connected;
    }

    public async disconnect(): Promise<void> {
        try {
            await this.sequelize.close();
            this.connected = false;
            this.sequelize = new Sequelize({} as any); // Reset the sequelize instance
            Logger.info('Database disconnected successfully');
        } catch (error) {
            Logger.error(`Error disconnecting from the database: ${error}`);
        }
    }

    public async beginTransaction(): Promise<Transaction> {
        if (!this.connected) {
            throw new Error("Database is not connected");
        }
        
        this.transaction = await this.sequelize.transaction();
        if (!this.transaction) {
            throw new Error("Failed to start database transaction");
        }
        return this.transaction;
    }

    public async getTransaction(): Promise<Transaction | null> {
        return this.transaction;
    }

    public async commitTransaction(): Promise<void> {
        if (!this.transaction) {
            throw new Error("No transaction to commit");
        }
        await this.transaction.commit();
        this.transaction = null;
    }

    public async rollbackTransaction(): Promise<void> {
        if (!this.transaction) {
            throw new Error("No transaction to rollback");
        }
        await this.transaction.rollback();
        this.transaction = null;
    }
}

export default new DatabaseConfig();