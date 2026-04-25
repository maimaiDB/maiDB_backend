import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception/service-exception-to-http-exception-filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의된 속성만 허용
    forbidNonWhitelisted: true, // 허용되지 않은 속성이 있을 경우 예외 발생
    transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
  }));
  // 커스텀 예외 필터 클래스인 ServiceExceptionToHttpExceptionFilter를 전역 필터로 등록하여 모든 예외를 처리하도록 설정 
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());

  app.use(cookieParser()); // 쿠키 파서 추가

  app.enableCors({
    origin: 'http://localhost:3000', // 클라이언트 도메인
    credentials: true, // 쿠키 허용
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();