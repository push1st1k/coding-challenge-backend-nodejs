import { Router } from 'express';
import { DepartmentController, TaskController, OfficerController } from './controllers';
const departmentController = new DepartmentController();
const officerController = new OfficerController();
const taskController = new TaskController();

export const department = Router();

department.get('/', departmentController.find);
department.post('/', departmentController.create);

export const officer = Router();

officer.get('/', officerController.find);
officer.post('/', officerController.create);

export const task = Router();

task.post('/', taskController.create);
task.post('/:id/resolve', taskController.resolve);
task.get('/', taskController.find);