import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { config } from '../../config';

const dbCfg: any = {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    database: config.database.name,
    username: config.database.user,
    password: config.database.password,
    operatorsAliases: Op,
    modelPaths: [__dirname + '/models/*.model.*'],
    modelMatch: (filename: string, member: string) => filename.substring(0, filename.indexOf('.model')) === member.toLowerCase()
};

export const sequelize = new Sequelize(dbCfg);