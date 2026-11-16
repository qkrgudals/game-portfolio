
# Game Portfolio

Unity PC 게임과 연동한 풀스택 게임 포트폴리오 웹사이트입니다.

React와 Spring Boot를 이용해 웹사이트를 개발하고,
Unity 게임의 플레이 기록을 서버에 저장하여
웹사이트에서 랭킹과 개인 기록을 확인할 수 있도록 구현했습니다.

## 1. 프로젝트 개요

- 프로젝트 유형: 개인 풀스택 웹 개발 프로젝트
- 프론트엔드: React
- 백엔드: Spring Boot
- 데이터베이스: MySQL / TiDB Cloud
- 게임 클라이언트: Unity (C#)
- 배포: Vercel / Render
- 버전 관리: Git, GitHub, SourceTree

## 2. 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | React, JavaScript, HTML, CSS, Vite |
| Backend | Java 21, Spring Boot 3.2.4, Spring Data JPA |
| Database | MySQL, TiDB Cloud |
| Game | Unity, C# |
| Deployment | Vercel, Render |
| Tools | IntelliJ IDEA, VS Code, Postman, SourceTree |

## 3. 주요 기능

### 회원가입 및 로그인
- 회원가입 및 로그인 API 구현
- 세션 기반 사용자 인증
- 비밀번호 암호화
- 로그아웃 및 세션 무효화
- 회원탈퇴 기능

### Unity 게임 다운로드
- PC용 오펜스 + 디펜스 게임 소개
- Google Drive를 통한 게임 다운로드
- Unity 게임 내 로그인 기능

### 게임 기록 및 랭킹
- Unity에서 스테이지 클리어 기록 전송
- Spring Boot API를 통한 게임 기록 저장
- 스테이지 내림차순, 클리어 시간 오름차순 정렬
- 사용자별 최고 기록을 기준으로 랭킹 표시

### 마이페이지
- 로그인한 사용자의 회원정보 조회
- 최고 클리어 스테이지 표시
- 최근 플레이 기록 조회
- 비밀번호 확인 후 회원탈퇴

## 4. 시스템 구조

```text
[React / Vercel]
       |
       | REST API
       v
[Spring Boot / Render]
       |
       | Spring Data JPA
       v
[TiDB Cloud]


[Unity PC Game]
       |
       | Login / Game Record API
       v
[Spring Boot / Render]
```

Unity 게임에서는 서버 로그인 후 발급받은
세션 쿠키를 이용해 게임 기록을 전송합니다.

## 5. API

| Method | Endpoint | 설명 |
|---|---|---|
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/logout | 로그아웃 |
| GET | /api/auth/csrf | CSRF 토큰 발급 |
| GET | /api/users/me | 회원정보 조회 |
| DELETE | /api/users/me | 회원탈퇴 |
| POST | /api/records | 게임 기록 등록 |
| GET | /api/records/me | 내 게임 기록 조회 |
| GET | /api/records/ranking | 전체 랭킹 조회 |
| GET | /api/projects | 프로젝트 조회 |
| GET | /api/projects/{id} | 프로젝트 상세 조회 |

## 6. 로컬 실행 방법

### Backend

Java 21과 MySQL을 준비한 후
DB_PASSWORD 환경변수를 설정합니다.

```bash
cd backend
./gradlew bootRun
```

Windows에서는 `gradlew.bat`을 사용합니다.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

개발 서버 기본 주소:

http://localhost:5173

## 7. 테스트 및 빌드

### React

```bash
npm run build
```

### Spring Boot

```bash
./gradlew clean build
```

Spring Boot 테스트에는 H2 메모리 데이터베이스를
사용하도록 테스트 프로필을 분리했습니다.


