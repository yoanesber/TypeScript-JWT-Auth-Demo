import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';

import User from './user.model';
import UserRole from './user-role.model';


/**
 * Role model representing a user role in the database.
 * This model includes fields for the role name, description, and timestamps for creation, update, and deletion.
 * It uses Sequelize decorators to define the schema and relationships.
 */
@Table({
    tableName: 'roles',
    timestamps: true,
    paranoid: true, // enable soft delete
})
class Role extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING(20),
    })
    name!: string;

    @AllowNull(true)
    @Column({
        type: DataType.TEXT,
    })
    description ? : string;

    @Column(DataType.BIGINT)
    createdBy ? : number;

    @CreatedAt
    @Column
    createdAt!: Date;

    @Column(DataType.BIGINT)
    updatedBy ? : number;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @Column(DataType.BIGINT)
    deletedBy ? : number;

    @DeletedAt
    @Column
    deletedAt ? : Date;

    // Many-to-many relationship with User through UserRole
    @BelongsToMany(() => User, () => UserRole)
    users ? : User[];
}

export default Role;