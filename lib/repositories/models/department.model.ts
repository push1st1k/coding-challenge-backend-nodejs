import { Table, Column, Model, HasMany, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

import { Officer } from './officer.model';

@ApiModel({
    description: 'Police Department',
    name: 'Department',
})
@Table
export class Department extends Model<Department> {

    @ApiModelProperty({
        description: 'Id of department'
    })
    @PrimaryKey
    @Column({autoIncrement: true})
    id: number;

    @ApiModelProperty({
        description: 'Name of department',
        required: true
    })
    @AllowNull(false)
    @Column
    name: string;

    @HasMany(() => Officer)
    officers: Officer[];
}