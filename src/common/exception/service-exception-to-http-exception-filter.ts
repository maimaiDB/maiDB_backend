import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ServiceException } from "./service.exception";
import { Response } from "express";

// Catch 데코레이터 : NestJS에서 제공하는 예외 필터 데코레이터
// @Catch(ServiceException) : ServiceException 예외가 발생했을 때 이 필터(클래스)가 해당 예외를 처리하도록 지정
/**
 * 동작 흐름
 * 1. NestJS 애플리케이션에서 ServiceException이 발생
 * 2. NestJS 내부 예외 처리 시스템이 예외 타입을 확인
 * 3. @Catch(ServiceException)이 붙은 필터(클래스)를 찾음
 * 4. 해당 필터(클래스) 내부의 catch() 메소드가 호출되어 ServiceException 예외 객체와 ArgumentsHost 객체를 전달받음
 * 5. catch 메서드 내부에서 ServiceException의 errorCode와 message를 토대로 HTTP 응답을 반환
 */
@Catch(ServiceException)
export class ServiceExceptionToHttpExceptionFilter implements ExceptionFilter {
    catch(exception: ServiceException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.errorCode.status;

        // ServiceException에서 에러코드와 메시지를 추출하여 HTTP 응답으로 변환
        response
            .status(status)
            .json({
                code: exception.errorCode.code,
                message: exception.message,
                timestamp: new Date().toISOString()
            });
    }
}