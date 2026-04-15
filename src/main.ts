import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception/service-exception-to-http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 커스텀 예외 필터 클래스인 ServiceExceptionToHttpExceptionFilter를 전역 필터로 등록하여 모든 예외를 처리하도록 설정 
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
