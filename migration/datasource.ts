import { DataSource, DataSourceOptions } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'mysql',
  logging: true,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'shopnest',
  entities: ['./dist/**/**.entity{.ts,.js}'],
  synchronize: true,
  bigNumberStrings: false,
  migrationsTableName: 'migrations',
  migrations: ['migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  },
} as DataSourceOptions);
