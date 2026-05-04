import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

// 업데이트 시 필요한 필드만 선택적으로 포함하는 DTO 클래스
// PartialType을 사용하여 SignUpDto의 모든 필드를 선택적으로 포함하도록 함
export class UpdateUserDto extends PartialType(SignUpDto) {
  // email, password는 SignUpDto를 통해 포함됨
  @IsOptional()
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  nickname?: string;

  @IsOptional()
  @IsNumber({}, { message: '플레이 횟수는 숫자여야 합니다.' })
  playCount?: number;

  @IsOptional()
  @IsNumber({}, { message: '최고 레이팅은 숫자여야 합니다.' })
  maxRating?: number;

  @IsOptional()
  @IsNumber({}, { message: '현재 레이팅은 숫자여야 합니다.' })
  currentRating?: number;

  @IsOptional()
  @IsBoolean({ message: '공개 여부는 boolean 값이어야 합니다.' })
  isPublic?: boolean;

  // NOTE: 혹시 모를 보안 이슈 방지를 위해 일단 role 필드는 업데이트에서 제외
  // 추후에 관리자 권한이 필요한 별도의 DTO로 분리할까?
  //   @IsOptional()
  //   @IsString({ message: '관리 권한 여부는 문자열이어야 합니다.' })
  //   role?: string;
}
