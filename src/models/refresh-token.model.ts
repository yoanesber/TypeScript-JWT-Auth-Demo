import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

import User from './user.model';

/**
 * RefreshToken model representing a refresh token in the database.
 * This model includes fields for the token, user ID, and expiration date.
 * It uses Sequelize decorators to define the schema and relationships.
 */
@Table({
    tableName: 'refresh_tokens',
    timestamps: false
})
class RefreshToken extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    token!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
    })
    userId!: number;

    // @BelongsTo(() => User)
    // user!: User;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expiresAt!: Date;
}

export default RefreshToken;