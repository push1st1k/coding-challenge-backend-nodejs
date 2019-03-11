import {Department, Officer} from './repositories/models';

export async function init() {
    const departments = [{
        name: 'NYC'
      }, {
        name: 'LA'
      }];
  
      const officers = [{
        name: 'Alex',
        departmentId: 1
      },{
        name: 'Bob',
        departmentId: 2
      }];

      const tasks = [];

      for (let dep of departments) {
          await Department.create(dep);
      }

      for (let off of officers) {
          await Officer.create(off);
      }
}