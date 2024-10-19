import typeOrmConfig from '../configs/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions,
);
