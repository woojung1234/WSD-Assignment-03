# WSD-Assignment-03

## 프로젝트 개요
**WSD-Assignment-03**은 채용 플랫폼의 백엔드 서버를 구현한 프로젝트로, 회원 관리, 채용 공고 관리, 지원서 작성 등 다양한 기능을 제공합니다. 이 프로젝트는 RESTful API를 기반으로 설계되었으며, JWT 인증 및 Swagger 문서를 통해 API를 테스트하고 사용할 수 있습니다.

---

## 주요 기능
### 1. 회원 관리
- 회원가입
- 로그인 및 로그아웃
- 사용자 정보 조회 및 수정
- 사용자 계정 삭제

### 2. 채용 공고 관리
- 공고 목록 조회 (필터링, 정렬, 페이지네이션)
- 공고 상세 조회 (관련 공고 추천 포함)
- 공고 지역별 통계 조회
- 인기 공고 조회

### 3. 지원서 관리
- 지원서 작성 (텍스트 기반)
- 지원서 목록 조회
- 지원서 삭제

### 4. API 문서화
- Swagger를 통해 API 사용법 및 테스트 환경 제공

---

## 기술 스택
- **Backend Framework**: Node.js (Express)
- **Database**: MongoDB
- **Authentication**: JWT
- **API Documentation**: Swagger

---

## 프로젝트 구조
```plaintext
WSD-Assignment-03/
├── src/
│   ├── config/
│   │   ├── db.js              # 데이터베이스 연결 설정
│   │   └── swagger.js         # Swagger 설정
│   ├── controllers/
│   │   ├── adminController.js  # 공고 승인 관련 컨트롤러
│   │   ├── authController.js  # 인증 관련 컨트롤러
│   │   ├── applcationController.js  # 지원 관련 컨트롤러
│   │   ├── bookmarkController.js  # 관심 공고 관련 컨트롤러
│   │   ├── compareController.js  # 인증 관련 컨트롤러
│   │   ├── jobController.js   # 채용 공고 관련 컨트롤러
│   │   ├── resumeController.js # 지원서 관련 컨트롤러
│   │   └── reviewController.js # 리뷰 관련 컨트롤러
│   ├── middlewares/
│   │   ├── authMiddleware.js  # 인증 미들웨어
│   │   └── responseMiddleware.js # 통일된 응답 처리
│   ├── models/
│   │   ├── Application.js            # 지원 모델
│   │   ├── Bookmark.js            # 관심공고 모델
│   │   ├── Company.js      # 회사 정보 모델
│   │   ├── JobCategory.js          # 종류 구분 모델
│   │   ├── JobPosting.js      # 채용 공고 모델
│   │   ├── JobStatus.js            # 공고 상태 모델
│   │   ├── LoginHistory.js          # 로그인 기록 모델
│   │   ├── Recruiter.js            # 채용자 모델
│   │   ├── Resume.js          # 지원서 모델
│   │   ├── Review.js          # 리뷰 모델
│   │   └── User.js          # 사용자 모델
│   ├── routes/
│   │   ├── admin.js            # 관리자 관련 라우트
│   │   ├── applications.js            # 지원 관련 라우트
│   │   ├── auth.js            # 인증 관련 라우트
│   │   ├── bookmarks.js         # 관심 공고 관련 라우트
│   │   ├── compare.js            # 공고 비교 관련 라우트
│   │   ├── jobs.js            # 채용 공고 관련 라우트
│   │   ├── resumes.js         # 지원서 관련 라우트
│   │   └── reviews.js         # 리뷰 관련 라우트
│   └── app.js                 # 애플리케이션 초기화 및 서버 실행
├── .env                        # 환경 변수 파일
├── README.md                   # 프로젝트 설명 파일
└── package.json                # 프로젝트 의존성 및 스크립트
```
## 설치 및 실행 방법
패키지 설치
npm install

## .env파일 제작

PORT=443
DB_URI=mongodb://kwj:1234@localhost:3000/job_platform
JWT_SECRET=057b12507a0321c7fa167d3c35f6083dc6247cdd948451994fd927894a96c9c8d2d8696fa7b461e8a62c979b1c57669ac7b958d18ffaf1e7bc4e8c968785b1ff
JWT_REFRESH_SECRET=38cff1a217195c44de5e77886e7e1a581539b91ed1ba8dd880e9b349a5c45a475f20a865ee789482de2881c9d87d660df940f08d66266607405777e4efd6dfd2
TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

## 서버 실행
npm start

## Swagger 사용
- 기본적으로 서버를 실행하고, MongoDB에 연결된 상태에서, 크롤링 데이터와 함께 작업이 가능합니다.
- 데이터베이스 설정이 완료되면, 지원서 및 리뷰와 같은 기본 기능을 테스트할 수 있습니다.
- job_id 등 id 관련된 것들은 회원가입 후 로그인 해서 얻은 access_token으로 인증 후 실제 id를 해당 입력 칸에 입력하세요.