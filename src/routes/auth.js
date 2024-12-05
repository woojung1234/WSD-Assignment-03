const express = require('express');
const { body } = require('express-validator');
const { getProfile, deleteProfile } = require('../controllers/authController');
const { register, login, refreshToken, logout, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어 가져오기

const router = express.Router(); // router 정의

// 회원가입
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  register
);

// 로그인
router.post(
  '/login',
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  login
);

// 사용자 정보 조회
router.get('/me', authMiddleware, getProfile);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/me', authMiddleware, deleteProfile);

module.exports = router; // router 내보내기

