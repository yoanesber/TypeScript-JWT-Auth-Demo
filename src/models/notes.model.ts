import {
    AllowNull,
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

/**
 * Note model representing a note in the database.
 * This model includes fields for title, content, and timestamps for creation, update, and deletion.
 * It uses Sequelize decorators to define the schema and relationships.
 */
@Table({
    tableName: 'notes',
    timestamps: true,
    paranoid: true, // enable soft delete
})
class Note extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING(150),
    })
    title!: string;

    @AllowNull(false)
    @Column({
        type: DataType.TEXT,
    })
    content!: string;

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
}

export default Note;