import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의된 속성만 허용
    forbidNonWhitelisted: true, // 허용되지 않은 속성이 있을 경우 예외 발생
    transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
