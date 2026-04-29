# maiDB-backend

maiDB의 백엔드 레포지토리

<br>

# 개발 환경 및 기술 스펙

- DBMS: PostgreSQL
- Version: 18.3
- Architecture: x86_64-windows
- ORM: TypeORM `0.3.x`
- Framework: NestJS `11.x`

<br>

# .env 구성

DB 연결은 .env파일을 통해 관리합니다.

.env 파일 위치 : `src/configs/env/`

_(2026/04/15 기준) .env파일의 이름을 .development.env로 작성해주세요!_

`.env` 예시

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=maidb-server-local

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRATION_TIME= 86400

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION_TIME= 1000000

CORS_ORIGIN=http://localhost:3000
```

<br>

# 개발 환경 세팅

본 레포지토리를 clone 한 이후, 하단의 메뉴얼을 따라 환경 세팅을 완료해주세요.

1. 상단의 `.env 구성`을 따라 .env파일 작성
2. `npm i` 커맨드를 실행하여 필요한 패키지 다운로드
3. `npm run migration:run` 커맨드를 실행하여 DB에 각종 테이블 생성

<br>

# 마이그레이션 관련 스크립트

본 프로젝트에선 TypeORM 마이그레이션을 사용하여 DB의 변경 내역을 관리합니다.

- `npm run migration:generate` : DB의 테이블과 entity의 내용을 비교하여 아직 DB에 적용되지 않은 entity 변경 내역을 추적, 해당 변경을 적용시키기 위한 Query문이 들어간 마이그레이션 파일 생성
- `npm run migration:run` : `npm run migration:generate`로 생성된 마이그레이션 파일을 실행 (실제 DB에 변경 내용 적용)
