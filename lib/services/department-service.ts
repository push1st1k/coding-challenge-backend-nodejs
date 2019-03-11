import { Department } from '../repositories/models';

export class DepartmentService {
    create(department: Department) {
        delete department.id;
        return Department.create(department);
    }

    findAll(query: Department) {
        return Department.findAndCountAll({where: query});
    }
};