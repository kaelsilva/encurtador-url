import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from 'dotenv';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

config();

export const typeOrmConfig: TypeOrmModuleOptions | DataSourceOptions = {
  type: 'postgres',
  host:
    process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join('dist', '**', '*.entity.{ts,js}')],
  migrations: [
    process.env.DB_SPECIFIC_MIGRATION
      ? join(
          __dirname,
          '..',
          'database',
          'migrations',
          process.env.DB_SPECIFIC_MIGRATION,
        )
      : join('dist', 'database', 'migrations', '*.{ts,js}'),
  ],
  migrationsTableName: 'migrations',
  synchronize: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
  ssl: false,
};

export default typeOrmConfig;
