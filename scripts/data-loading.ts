import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

// Create a TypeORM connection
const connection = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: +process.env['DB_PORT'],
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
});

// Function to execute SQL file
async function executeSqlFile(filePath: string, queryRunner) {
  const sql = readFileSync(filePath, 'utf8');
  try {
    await queryRunner.query(sql);
  } catch (err) {
    console.error('Error executing SQL file:', err);
    throw err;
  }
}

// Path to your SQL files
export const startDataLoading = async () => {
  const sqlFilesDir = join(process.cwd(), './data');
  await connection.initialize();
  const queryRunner = connection.createQueryRunner();
  const orderTable = [
    'user',
    'module',
    'permission',
    'role',
    'role_permission_permission',
    'user_roles_roles',
  ];

  const sqlFiles = readdirSync(sqlFilesDir);

  // Filter and sort the files based on the orderTable array
  const orderedFiles = orderTable
    .map((tableName) => `${tableName}.sql`)
    .filter((file) => sqlFiles.includes(file));

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    for (const file of orderedFiles) {
      await executeSqlFile(join(sqlFilesDir, file), queryRunner);
    }
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};
