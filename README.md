# WSD-Assignment-03

## 프로젝트 개요
**WSD-Assignment-03**은 채용 플랫폼의 백엔드 서버를 구현한 프로젝트로, 회원 관리, 채용 공고 관리, 지원서 작성 등 다양한 기능을 제공합니다. 이 프로젝트는 RESTful API를 기반으로 설계되었으며, JWT 인증 및 Swagger 문서를 통해 API를 테스트하고 사용할 수 있습니다.

---

## 주요 기능
### 1. 회원 관리
- **회원가입**: 이메일과 비밀번호를 입력하여 사용자 등록.
- **로그인 및 로그아웃**: JWT를 이용한 인증 및 로그아웃 기능.
- **사용자 정보 조회 및 수정**: 사용자 정보를 조회하거나 수정.
- **사용자 계정 삭제**: 계정을 삭제하여 서비스 이용 중단.

### 2. 채용 공고 관리
- **공고 목록 조회**: 필터링, 정렬, 페이지네이션 기능 지원.
- **공고 상세 조회**: 공고에 대한 상세 정보와 관련 공고 추천 제공.
- **공고 지역별 통계 조회**: 지역별 공고 수 통계.
- **인기 공고 조회**: 조회수가 높은 공고 목록 제공.

### 3. 지원 관리
- **지원하기**: 사용자가 공고에 지원 가능.
- **지원 내역 조회**: 사용자가 지원한 공고 확인 가능.
- **지원 취소**: 신청한 공고 취소 가능.

### 4. 북마크 관리
- **북마크 추가/삭제**: 관심 있는 공고를 북마크.
- **북마크 목록 조회**: 저장된 북마크 목록 확인.

### 5. 공고 비교
- **공고 비교 기능**: 두 개 이상의 공고를 비교하여 상세 정보를 제공.

### 6. 리뷰 관리
- **리뷰 작성**: 공고에 대한 리뷰 작성.
- **리뷰 목록 조회**: 작성된 리뷰를 확인 가능.
- **리뷰 삭제**: 작성한 리뷰를 삭제 가능.

### 7. 지원 관리 (/resumes)
- **지원서 작성**: 사용자가 본인을 알리는 지원서를 작성 가능.
- **지원서 목록 조회**: 작성한 지원서를 확인 가능.
- **지원서 삭제**: 작성한 지원서를 삭제 가능.

### 8. 관리자 기능
- **공고 승인**: 관리자가 공고를 승인하거나 거절 가능.

### 9. API 문서화
- **Swagger를 통한 문서화**: API 사용법과 테스트 환경 제공.

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
│   ├── controllers/ # 요청에 대한 비즈니스 로직 처리
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
│   ├── models/ # 데이터베이스 스키마 정의
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
│   ├── routes/ # API 엔드포인트 정의
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

npm 실행이 안된다면?
- Get-ExecutionPolicy 명령어 입력 후 Restricted로 설정되어 있다면, Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
 명령어 입력 후 npm install


## .env파일 제작

PORT=443
DB_URI=mongodb://username:password@host:port/database
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

## 서버 실행
npm start (필요 시 sudo npm start)

## Swagger 사용
- 서버는 배포된 상태입니다. http://113.198.66.75:17080/api-docs 에서 Swagger를 실행할 수 있습니다.
- 데이터베이스 설정이 완료되면, 지원서 및 리뷰와 같은 기본 기능을 테스트할 수 있습니다.
- job_id 등 id 관련된 것들은 회원가입 후 로그인 해서 얻은 access_token으로 인증 후 실제 id를 해당 입력 칸에 입력하세요.
- **JWT 인증**:
  - API 사용 시, 회원가입 후 로그인하여 받은 `access_token`을 Authorization 헤더에 포함해야 합니다.
  - 예: `Authorization: Bearer your_access_token`