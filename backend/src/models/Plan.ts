import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";

export interface Info{
    distance: number;
    climb: number;
    fall: number;
    max: number;
    min: number;
}
@Table(
    {
        timestamps:true,
        tableName: 'plans'
    }
)
class Plan extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(
        {
            type: DataType.INTEGER,
            allowNull: false,
        }
    )
    id!:number;

    @Column(
        {
            type: DataType.STRING,
            allowNull: false
        }
    )
    name!: string;

    @Column(
        {
            type: DataType.STRING,
            allowNull: false
        }
    )
    path!: string;

    @Column(
        {
            type: DataType.STRING,
            allowNull: false
        }
    )
    thumbnail!: string;

    @Column(
        {
            type: DataType.JSON,
            allowNull: false
        }
    )
    info!: Info;

    @ForeignKey(() => User) // Define the foreign key relationship
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    ownerId!: number;

    @BelongsTo(() => User) // Define the belongs-to relationship
    owner!: User;
}

export default Plan;