// 에러코드 값을 담을 객체 정의
class ErrorCodeVo {
    readonly status;
    readonly code;
    readonly message;

    constructor(status, code, message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}

export type ErrorCode = ErrorCodeVo;

// 아래에 에러 코드 값 객체를 생성하여 export
export const INVALID_ID_FORMAT = new ErrorCodeVo(400, 'INVALID_ID_FORMAT', 'ID 형식이 올바르지 않습니다.');
export const INVALID_JWT_FORMAT = new ErrorCodeVo(400, 'INVALID_JWT_FORMAT', 'JWT 형식이 올바르지 않습니다.');
export const INVALID_CREDENTIALS = new ErrorCodeVo(401, 'INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.');
export const TOKEN_EXPIRED = new ErrorCodeVo(401, 'TOKEN_EXPIRED', '토큰이 만료되었습니다.');
export const INVALID_JWT_TOKEN = new ErrorCodeVo(401, 'INVALID_JWT_TOKEN', '유효하지 않은 JWT 토큰입니다.');
export const USER_NOT_FOUNDED = new ErrorCodeVo(404, 'USER_NOT_FOUNDED', '해당 유저가 발견되지 않았습니다.');
export const EMAIL_ALREADY_EXISTS = new ErrorCodeVo(409, 'EMAIL_ALREADY_EXISTS', '이미 사용 중인 이메일입니다.');