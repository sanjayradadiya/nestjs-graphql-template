import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  database: 'admin-template-graphql',
  password: 'root',
  entities: ['../**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
  logging: true,
});
