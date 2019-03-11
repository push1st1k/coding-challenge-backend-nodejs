import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Department, Officer, Task } from '../repositories/models';

@ApiModel({
    description: 'Department Paging response',
    name: 'DepartmentPagingResponse',
})
export class DepartmentPagingResponse {
    @ApiModelProperty({
        description: 'Number of items',
        required: true
    })
    count: number;

    @ApiModelProperty({
        description: 'Items',
        required: true,
        model: 'Department'
    })
    rows: Department[]
}

@ApiModel({
    description: 'Officer Paging response',
    name: 'OfficerPagingResponse',
})
export class OfficerPagingResponse {
    @ApiModelProperty({
        description: 'Number of items',
        required: true
    })
    count: number;

    @ApiModelProperty({
        description: 'Items',
        required: true,
        model: 'Officer'
    })
    rows: Officer[]
}

@ApiModel({
    description: 'Task Paging response',
    name: 'TaskPagingResponse',
})
export class TaskPagingResponse {
    @ApiModelProperty({
        description: 'Number of items',
        required: true
    })
    count: number;

    @ApiModelProperty({
        description: 'Items',
        required: true,
        model: 'Task'
    })
    rows: Task[]
}

@ApiModel({
    description: 'Bad Request Error',
    name: 'BadRequestError',
})
export class BadRequestError {
    @ApiModelProperty({
        description: 'Error message',
        required: true
    })
    error: string;
}