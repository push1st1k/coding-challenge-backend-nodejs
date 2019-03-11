import { NextFunction, Response, Request } from 'express';
import { TaskService } from '../services';
const taskService = new TaskService();
import {
    ApiPath,
    SwaggerDefinitionConstant,
    ApiOperationPost,
    ApiOperationGet,
} from 'swagger-express-ts';

@ApiPath({
    path: "/v1/task",
    name: "Task",
    security: { }
})
export class TaskController {

  @ApiOperationPost({
    description: 'Creates a task',
    parameters: {
      body: {
        model: 'Task'
      }
    },
    responses: {
        201: {},
        400: {
          model: 'BadRequestError'
        }
    }
  })
  async create (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskService.create(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };
  
  @ApiOperationPost({
    description: 'Resolves a task',
    path: '/{id}/resolve',
    parameters: {
      path: {
        id: {
          name: 'id',
          type: SwaggerDefinitionConstant.Response.Type.NUMBER,
          required: true
        }
      }
    },
    responses: {
        204: {},
        400: {
          model: 'BadRequestError'
        }
    }
  })
  async resolve (req: Request, res: Response, next: NextFunction) {
    try {
      await taskService.resolve(req.params.id);
      res.status(204).json(null);
    } catch (e) {
      next(e);
    }
  };
    
  @ApiOperationGet({
    description: 'Get tasks',
    parameters: {
      query: {
        id: {
          name: 'id'
        },
        description: {
          name: 'description'
        },
        state: {
          name: 'state'
        },
        licenseNumber: {
          name: 'licenseNumber'
        },
        color: {
          name: 'color'
        },
        type: {
          name: 'type'
        },
        owner: {
          name: 'owner'
        },
        officerId: {
          name: 'officerId'
        }
      }
    },
    responses: {
        200: {
            model: 'TaskPagingResponse'
        },
        400: {
          model: 'BadRequestError'
        }
    }
  })
  async find(req: Request, res: Response, next: NextFunction)  {
    try {
      const results = await taskService.find(req.query);
      res.status(200).json(results);
    } catch (e) {
      next(e);
    }
  };
}