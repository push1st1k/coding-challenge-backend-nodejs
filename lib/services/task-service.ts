import { Task, Officer, Department, STATES } from '../repositories/models';

export class TaskService {
    async create(task: Task) {
        const availableOfficer = await Officer.findOne({
            where: { taskId: null }
        });
        task.state = availableOfficer ? STATES.IN_PROGRESS : STATES.NEW;
        task.officerId = availableOfficer && availableOfficer.id;
        const newTask = await Task.create(task);

        if (availableOfficer) {
            availableOfficer.taskId = newTask.id;
            await availableOfficer.save();
        }

        return newTask;
    }

    async resolve(taskId: number) {
        const currentTask = await Task.findByPk(taskId);

        if (!currentTask) {
            throw new Error('Task does not exist');
        }
        if (currentTask.state === STATES.RESOLVED) {
            throw new Error('Task already resolved');
        }
        if (currentTask.officerId === null) {
            throw new Error('Task has no officer assigned');
        }

        const officerId = Number(currentTask.officerId);
        currentTask.state = STATES.RESOLVED;
        currentTask.officerId = null;

        await currentTask.save();

        await this.assignNextTask(officerId);
    }

    async assignNextTask(officerId: number) {
        const unassignedTask = await Task.findOne({
            where: {
                state: STATES.NEW
            }
        });

        await Officer.update({taskId: unassignedTask && unassignedTask.id}, {where: {id: officerId}});

        if (!unassignedTask) {
            console.log('there are no new tasks!');
            return;
        }

        unassignedTask.officerId = officerId;
        unassignedTask.state = STATES.IN_PROGRESS;

        return await unassignedTask.save();
    }

    find(query: Task) {
        return Task.findAndCountAll({
            where: query,
            include: [{model: Officer, include: [Department]}]
        });
    }
};