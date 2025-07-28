import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';

import Role from './role.model';
import User from './user.model';


/**
 * UserRole model representing the many-to-many relationship between User and Role.
 * This model includes foreign keys for userId and roleId, linking users to their roles.
 * It uses Sequelize decorators to define the schema and relationships.
 */
@Table({
    tableName: 'user_roles',
    timestamps: false
})
class UserRole extends Model {
    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId!: number;

    @ForeignKey(() => Role)
    @Column(DataType.INTEGER)
    roleId!: number;
}

export default UserRole;