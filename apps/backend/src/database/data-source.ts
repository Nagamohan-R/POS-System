import { DataSource } from 'typeorm';
import config from '@config/index';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [path.join(__dirname, '../modules/**/entities/*.entity.ts')],
  migrations: [path.join(__dirname, './migrations/*.ts')],
  subscribers: [path.join(__dirname, '../modules/**/subscribers/*.subscriber.ts')],
});