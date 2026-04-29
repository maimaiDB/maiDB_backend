import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: 'src/configs/env/.development.env' });

/**
 * CHECKLIST
 * [x] TODO: DB 연결 정보를 보호하기 위해 .env 파일로 관리하도록 변경
 * [ ] TODO: production 환경에서는 별도의 .env 파일을 사용하도록 설정 (예: .production.env)
 */
// console.log('PASSWORD:', process.env.DB_PASSWORD);
// console.log('TYPEOF:', typeof process.env.DB_PASSWORD);

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'postgres', // postgres db를 명시
    host: process.env.DB_HOST, // postgres host
    port: parseInt(process.env.DB_PORT!), // postgres port
    username: process.env.DB_USERNAME, // db username
    password: process.env.DB_PASSWORD, // db password
    database: process.env.DB_DATABASE, // database name
    entities: [__dirname + '/../**/*.entity.{js,ts}'], // entity class를 기반으로 테이블을 생성할 수 있도록 entity 파일 규칙 정의
    synchronize: false,
    migrations: [__dirname + '/../migrations/*.ts'],
    migrationsTableName: 'migrations',
};

// migration:generate를 위한 DataSource 추가
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../migrations/*.ts'],
});