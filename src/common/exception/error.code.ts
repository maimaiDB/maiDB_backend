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
export const USER_NOT_FOUNDED = new ErrorCodeVo(404, 'USER_NOT_FOUNDED', '해당 ID의 유저가 발견되지 않았습니다.');
export const EMAIL_ALREADY_EXISTS = new ErrorCodeVo(409, 'EMAIL_ALREADY_EXISTS', '이미 사용 중인 이메일입니다.');