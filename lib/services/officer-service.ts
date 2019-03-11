import { Officer, Department } from '../repositories/models';
import { TaskService } from './task-service';
const taskService = new TaskService();

export class OfficerService {
    async create(officer: Officer) {
        delete officer.id;
        const created = await Officer.create(officer);
        const nextTask = await taskService.assignNextTask(created.id);

        if (nextTask) {
            created.taskId = nextTask.id;
        }
        return created;
    }

    findAll(query: Officer) {
        return Officer.findAndCountAll({where: query, include: [Department]});
    }
};