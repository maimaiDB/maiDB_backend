import { SetMetadata } from '@nestjs/common';

// 메타데이터를 설정하는 역할을 하는 커스텀 데코레이터
// @Roles('admin', 'user')와 같이 사용하여, 해당 핸들러에 필요한 역할을 지정할 수 있음
export const Roles = (...roles: string[]) =>
    SetMetadata('roles', roles);