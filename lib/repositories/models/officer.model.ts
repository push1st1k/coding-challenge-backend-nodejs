import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { Department } from './department.model';
import { Task } from './task.model';

@ApiModel({
    description: 'Police Officer',
    name: 'Officer',
})
@Table
export class Officer extends Model<Officer> {

    @ApiModelProperty({
        description: 'Id of officer'
    })
    @PrimaryKey
    @Column({autoIncrement: true})
    id: number;

    @ApiModelProperty({
        description: 'Name of officer',
        required: true
    })
    @AllowNull(false)
    @Column
    name: string;

    @ApiModelProperty({
        description: 'Department ID',
        required: true
    })
    @AllowNull(false)
    @ForeignKey(() => Department)
    @Column
    departmentId: number;

    @BelongsTo(() => Department)
    department: Department;

    @ForeignKey(() => Task)
    @Column
    taskId: number;

    @BelongsTo(() => Task, { constraints: false })
    task: Task;
}