import { NextFunction, Response, Request } from 'express';
import { DepartmentService } from '../services';
const departmentService = new DepartmentService();
import {
  ApiPath,
  SwaggerDefinitionConstant,
  ApiOperationPost,
  ApiOperationGet,
} from 'swagger-express-ts';

@ApiPath({
  path: "/v1/department",
  name: "Department",
  security: { }
})
export class DepartmentController {
  
  @ApiOperationGet({
    description: 'Get departments',
    parameters: {
      query: {
        id: {
          name: 'id'
        },
        name: {
          name: 'name'
        }
      }
    },
    responses: {
        200: {
            model: 'DepartmentPagingResponse',
            type: SwaggerDefinitionConstant.Response.Type.OBJECT
        },
        400: {
          model: 'BadRequestError',
          type: SwaggerDefinitionConstant.Response.Type.OBJECT
        }
    }
  })
  async find (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await departmentService.findAll(req.query);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
  
  @ApiOperationPost({
    description: 'Creates a department',
    parameters: {
      body: {
        model: 'Department'
      }
    },
    responses: {
        201: {
          model: 'Department'
        },
        400: {
          model: 'BadRequestError',
          type: SwaggerDefinitionConstant.Response.Type.OBJECT
        }
    }
  })
  async create (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await departmentService.create(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };
}