import { NextFunction, Response, Request } from 'express';
import { OfficerService } from '../services';
const officerService = new OfficerService();
import {
  ApiPath,
  SwaggerDefinitionConstant,
  ApiOperationPost,
  ApiOperationGet,
} from 'swagger-express-ts';

@ApiPath({
  path: "/v1/officer",
  name: "Officer",
  security: { }
})
export class OfficerController {
    
@ApiOperationGet({
  description: 'Get officers',
  parameters: {
    query: {
      id: {
        name: 'id'
      },
      name: {
        name: 'name'
      },
      departmentId: {
        name: 'departmentId'
      }
    }
  },
  responses: {
      200: {
          model: 'OfficerPagingResponse'
      },
      400: {
        model: 'BadRequestError'
      }
  }
})
async find (req: Request, res: Response, next: NextFunction) {
  try {
    const result = await officerService.findAll(req.query);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

@ApiOperationPost({
  description: 'Creates a officer',
  parameters: {
    body: {
      model: 'Officer'
    }
  },
  responses: {
      201: {
        model: 'Officer'
      },
      400: {
        model: 'BadRequestError',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT
      }
  }
})
async create (req: Request, res: Response, next: NextFunction) {
  try {
    const result = await officerService.create(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
}