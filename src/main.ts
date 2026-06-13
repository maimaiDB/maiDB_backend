import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceExceptionToHttpExceptionFilter } from './common/exception/service-exception-to-http-exception-filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 속성만 허용
      forbidNonWhitelisted: true, // 허용되지 않은 속성이 있을 경우 예외 발생
      transform: true, // 요청 데이터를 DTO 인스턴스로 자동 변환
    }),
  );
  // 커스텀 예외 필터 클래스인 ServiceExceptionToHttpExceptionFilter를 전역 필터로 등록하여 모든 예외를 처리하도록 설정
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());

  app.use(cookieParser()); // 쿠키 파서 추가

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000',
    credentials: true, // 쿠키 허용
  });

  // 제한되어있던 body의 크기를 늘려줌
  app.use(json({ limit: '50mb' }));

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('maiDB API 문서')
    .setDescription('maiDB API 명세서입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    ) // JWT 인증 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
