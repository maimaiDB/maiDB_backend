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

# 환경 구성
DB 연결은 .env파일을 통해 관리합니다.

.env 파일 위치 : `src/configs/env/`

*(2026/04/15 기준) .env파일의 이름을 .development.env로 작성해주세요!*

`.env` 예시

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=maidb-server-local
```

<br>

# 마이그레이션 관리

마이그레이션 관련 내용 작성 예정