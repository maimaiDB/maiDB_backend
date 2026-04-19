import { EMAIL_ALREADY_EXISTS, ErrorCode, INVALID_CREDENTIALS, INVALID_ID_FORMAT, INVALID_JWT_FORMAT, INVALID_JWT_TOKEN, TOKEN_EXPIRED, USER_NOT_FOUNDED } from "./error.code";

// error 클래스를 상속받은 ServiceException 클래스 정의
// serviceException 클래스는 NestJS의 ExceptionFilter에서 감지하기 위한 커스텀 예외 클래스
// (error 클래스는 name, message, stack을 가지는 에러 객체의 최상위 부모)
export class ServiceException extends Error {
    readonly errorCode: ErrorCode;

    constructor(errorCode: ErrorCode, message?: string) {
        super(message ? message : errorCode.message);

        this.errorCode = errorCode;
    }
}

// error.code.ts에서 정의된 에러 코드를 토대로 ServiceException을 생성하는 함수 정의
export const InvalidIdFormatException = (message?: string): ServiceException => {
    return new ServiceException(INVALID_ID_FORMAT, message);
}

export const InvalidJwtFormatException = (message?: string): ServiceException => {
    return new ServiceException(INVALID_JWT_FORMAT, message);
}

export const InvalidCredentialsException = (message?: string): ServiceException => {
    return new ServiceException(INVALID_CREDENTIALS, message);
}

export const TokenExpiredException = (message?: string): ServiceException => {
    return new ServiceException(TOKEN_EXPIRED, message);
}

export const InvalidJwtTokenException = (message?: string): ServiceException => {
    return new ServiceException(INVALID_JWT_TOKEN, message);
}

export const UserNotFoundedException = (message?: string): ServiceException => {
    return new ServiceException(USER_NOT_FOUNDED, message);
}

export const EmailAlreadyExistsException = (message?: string): ServiceException => {
    return new ServiceException(EMAIL_ALREADY_EXISTS, message);
}