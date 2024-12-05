const express = require('express');
const { body } = require('express-validator');
const { getProfile, deleteProfile } = require('../controllers/authController');
const { register, login, refreshToken, logout, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어 가져오기

const router = express.Router(); // router 정의

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     description: 이메일과 비밀번호를 사용하여 새로운 사용자를 등록합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: "회원가입 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *       400:
 *         description: "잘못된 요청 (예: 이메일 중복, 잘못된 형식 등)"
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호를 사용하여 로그인하고 JWT 토큰을 반환합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: "로그인 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: "잘못된 요청 (예: 잘못된 이메일 또는 비밀번호)"
 */
router.post(
  '/login',
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 사용자 정보 조회
 *     description: 로그인된 사용자의 정보를 반환합니다.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "사용자 정보 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: "인증 실패"
 */
router.get('/me', authMiddleware, getProfile);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     description: Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: "유효한 Refresh 토큰"
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: "토큰 갱신 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: "유효하지 않은 Refresh 토큰"
 *       500:
 *         description: "서버 오류"
 */
router.post('/refresh', authMiddleware, refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     description: Refresh 토큰을 삭제하여 사용자를 로그아웃 처리합니다.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "로그아웃 성공"
 *       403:
 *         description: "유효하지 않은 Refresh 토큰"
 *       500:
 *         description: "서버 오류"
 */
router.post('/logout', authMiddleware, logout);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 사용자 정보 수정
 *     description: 로그인된 사용자의 프로필 정보를 수정합니다.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword456
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: "사용자 정보 수정 성공"
 *       400:
 *         description: "잘못된 요청 (예: 현재 비밀번호 불일치)"
 *       401:
 *         description: "인증 실패"
 *       500:
 *         description: "서버 오류"
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: 사용자 계정 삭제
 *     description: 로그인된 사용자의 계정을 삭제합니다.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "계정 삭제 성공"
 *       401:
 *         description: "인증 실패"
 *       404:
 *         description: "사용자 계정을 찾을 수 없음"
 *       500:
 *         description: "서버 오류"
 */
router.delete('/me', authMiddleware, deleteProfile);

module.exports = router; // router 내보내기
