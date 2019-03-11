import { Table, Column, Model, PrimaryKey, BelongsTo, ForeignKey, DataType, AllowNull } from 'sequelize-typescript';
import { Officer } from './officer.model';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export const STATES = {
    NEW: 'New',
    IN_PROGRESS: 'In progress',
    RESOLVED: 'Resolved'
};

@ApiModel({
    description: 'Task with info about theft case, responsible officer and status',
    name: 'Task',
})
@Table
export class Task extends Model<Task> {

    @ApiModelProperty({
        description: 'Id of task'
    })
    @PrimaryKey
    @Column({autoIncrement: true})
    id: number;

    @ApiModelProperty({
        description: 'Crime description',
        required: true,
    })
    @AllowNull(false)
    @Column
    description: string;

    @ApiModelProperty({
        description: 'Task status',
        enum: Object.values(STATES),
        required: true,
    })
    @AllowNull(false)
    @Column
    state: string;

    @ApiModelProperty({
        description: 'Bike license number',
        required: true
    })
    @AllowNull(false)
    @Column
    licenseNumber: string;

    @ApiModelProperty({
        description: 'Bike color',
        required: true
    })
    @AllowNull(false)
    @Column
    color: string;

    @ApiModelProperty({
        description: 'Bike type',
        required: true
    })
    @AllowNull(false)
    @Column
    type: string;

    @ApiModelProperty({
        description: 'Bike owner',
        required: true
    })
    @AllowNull(false)
    @Column
    owner: string;

    @Column({
        type: DataType.INTEGER
    })
    @ForeignKey(() => Officer)
    officerId: number | null;
    
    @BelongsTo(() => Officer, { constraints: false })
    officer: Officer;
}