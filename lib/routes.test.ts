process.env.DB_NAME = 'anti_theft_test';

import {agent, SuperTest, Test} from 'supertest';
import { app } from './app';
import { sequelize } from './repositories/database';
import { Officer, Department } from './repositories/models';

let server: SuperTest<Test>;
beforeAll(async () => {
    server = agent(app);
    await sequelize.sync({force: true});

    const departmentRes = await server.post('/v1/department')
        .send({name: 'Dep1'});
    await server.post('/v1/department')
        .send({name: 'Dep2'});
    await server.post('/v1/officer')
        .send({name: 'Officer1', departmentId: departmentRes.body.id});
    await server.post('/v1/officer')
        .send({name: 'Officer2', departmentId: departmentRes.body.id});
});

afterAll(async () => {
    await sequelize.close();
    await new Promise(resolve => setTimeout(resolve, 500)); // prevents from Jest complaining about open connections
});

describe('/department', () => {
    describe('GET', () => {
        test('get all', async () => {
            const response = await server.get('/v1/department');
    
            expect(response.status).toBe(200);
        });
        
        test('find department by name', async () => {
            await server.post('/v1/department')
                .send({name: 'DepByName1'});
            await server.post('/v1/department')
                .send({name: 'DepByName2'});
                
            const response = await server.get('/v1/department?name=DepByName1');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].name).toBe('DepByName1');
        });
    
        test('NOT find department by non existing name', async () => {
            const response = await server.get('/v1/department?name=non_existing_dep');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(0);
        });
    });
    
    describe('POST', () => {
        test('create new', async () => {
            const response = await server.post('/v1/department')
                .send({name: 'Dep 1'});
    
            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Dep 1');
            expect(response.body.id).toBeDefined();
        });

        test('NOT create w/o name', async () => {
            const response = await server.post('/v1/department');

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Department.name cannot be null');
        });
    });
});

describe('/officer', () => {
    describe('GET', () => {
        const path = '/v1/officer';

        test('get all', async () => {
            const response = await server.get(path);
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);
        });
        
        test('find officer by name', async () => {
            const response = await server.get(path + '?name=Officer1');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].name).toBe('Officer1');
        });
        
        test('find officer by department', async () => {
            const response = await server.get(path + '?departmentId=1');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);
            response.body.rows.forEach((row: Officer) => {
                expect(row.departmentId).toBe(1);
            });
        });
    
        test('NOT find officer by non existing name', async () => {
            const response = await server.get(path + '?name=non_existing_officer');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(0);
        });
    });
    
    describe('POST', () => {
        const path = '/v1/officer';

        test('create new', async () => {
            const response = await server.post(path)
                .send({name: 'Officer 3', departmentId: 2});
    
            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Officer 3');
            expect(response.body.departmentId).toBe(2);
            expect(response.body.id).toBeDefined();
        });

        test('NOT create w/o name', async () => {
            const response = await server.post(path)
                .send({departmentId: 1});

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Officer.name cannot be null');
        });
        
        test('NOT create w/o department', async () => {
            const response = await server.post(path)
                .send({name: 'withot department'});

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Officer.departmentId cannot be null');
        });
    });
});

describe('/task', () => {
    const path = '/v1/task';
    beforeAll(async () => {
        const taskRes = await server.post('/v1/task')
            .send({
                description: 'Bike was stolen 1/1/19.', 
                licenseNumber: 'LN358YN2', 
                color: 'black-white', 
                type: 'trail', 
                owner: 'Upset owner', 
            });
    });

    describe('GET', () => {

        test('get all', async () => {
            const response = await server.get(path);
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
        });

        test('check that task was assigned', async () => {
            const response = await server.get(path);

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            const task = response.body.rows[0];
            expect(task.officerId).toBeDefined();
        });

        test('resolve a task', async () => {
            const tasksRes = await server.get(path);
            const task = tasksRes.body.rows[0];

            const response = await server.post(path + `/${task.id}/resolve`);
            expect(response.status).toBe(204);
            const resolvedTask = await server.get(`${path}?id=${task.id}`);

            expect(resolvedTask.body.rows[0].state).toBe('Resolved');
        });
        
        test('throw an error resolving previously resolved task', async () => {
            const tasksRes = await server.get(path);
            const task = tasksRes.body.rows[0];
            
            const response = await server.post(path + `/${task.id}/resolve`);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task already resolved');
        });
        
        test('throw an error resolving non-existing task', async () => {
            const response = await server.post(path + `/100/resolve`);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task does not exist');
        });
        
        test('keep task in NEW state if there are no available officer', async () => {
            await server.post('/v1/task')
                .send({
                    description: 'Case0', 
                    licenseNumber: 'LN358YN2', 
                    color: 'pink', 
                    type: 'trail', 
                    owner: 'Upset owner', 
                });
            await server.post('/v1/task')
                .send({
                    description: 'Case1', 
                    licenseNumber: 'LN358YN2', 
                    color: 'pink', 
                    type: 'trail', 
                    owner: 'Upset owner', 
                });
            await server.post('/v1/task')
                .send({
                    description: 'Case2', 
                    licenseNumber: 'LN358YN2', 
                    color: 'pink', 
                    type: 'trail', 
                    owner: 'Upset owner', 
                });
            await server.post('/v1/task')
                .send({
                    description: 'Case3', 
                    licenseNumber: 'LN358YN2', 
                    color: 'pink', 
                    type: 'trail', 
                    owner: 'Upset owner', 
                });

            const response = await server.get(path + `?description=Case3`);
            expect(response.status).toBe(200);
            expect(response.body.rows[0].state).toBe('New');
        });

        test('throw an error if new task tries to be resolved', async () => {
            const tasks = await server.get(path + `?state=New`);
            expect(tasks.body.count).toBeGreaterThan(0);

            const response = await server.post(path + `/${tasks.body.rows[0].id}/resolve`);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task has no officer assigned');
        });

        test('assign new task to the officer', async () => {
            const officers = await server.get('/v1/officer');
            const officer = officers.body.rows[0];

            await server.post('/v1/task')
                .send({
                    description: 'Case4', 
                    licenseNumber: 'LN358YN2', 
                    color: 'pink', 
                    type: 'trail', 
                    owner: 'Upset owner', 
                });

            console.log('>>>', officer.taskId);
            expect(officer.taskId).toBeDefined();
            await server.post(path + `/${officer.taskId}/resolve`);

            const officerWithNewTask = (await server.get(`/v1/officer?id=${officer.id}`)).body.rows[0];

            console.log('>>>', officerWithNewTask.taskId);
            expect(officerWithNewTask.taskId).toBeDefined();
            expect(officer.taskId).not.toEqual(officerWithNewTask.taskId);
        });
        
        test('find task by params', async () => {
            const response = await server.get(path + '?color=black-white');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            //TODO check other params
        });
    
        test('NOT find task by non existing param', async () => {
            const response = await server.get(path + '?color=non_existing');
    
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(0);
        });
    });
    
    describe('POST', () => {
        test('create new', async () => {
            const response = await server.post(path)
                .send({
                    description: 'One more stolen bike', 
                    licenseNumber: '12345', 
                    color: 'white', 
                    type: 'trail', 
                    owner: 'Bob', 
                });
    
            expect(response.status).toBe(201);
            expect(response.body.id).toBeDefined();
        });
    });
});