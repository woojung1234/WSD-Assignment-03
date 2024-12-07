const User = require('../models/User');
const jwt = require('jsonwebtoken');
const LoginHistory = require('../models/LoginHistory');

// Refresh Token 저장 (메모리 기반)
let refreshTokens = [];

// 회원가입
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 입력 데이터 검증
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 비밀번호 암호화 (Base64 사용)
    const encodedPassword = Buffer.from(password).toString('base64');

    // 새 사용자 생성
    const newUser = new User({ email, password: encodedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 비밀번호 확인 (Base64 복호화 후 비교)
    const decodedPassword = Buffer.from(user.password, 'base64').toString('utf8');
    if (decodedPassword !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // JWT 토큰 발급
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Refresh Token 저장
    user.refreshToken = refreshToken;
    await user.save();

    // **로그인 이력 저장**
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const device = req.headers['user-agent'] || 'Unknown Device';

    await LoginHistory.create({
      user: user._id,
      ip,
      device,
    });

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body; // 필드 이름 일치

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh Token is required' });
    }

    // 사용자 확인
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Refresh Token is invalid' });
    }

    // Refresh Token 검증
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid Refresh Token', error: err.message });
      }

      // Access Token 재발급
      const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Refresh Token' });
    }

    // Refresh Token 제거
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { currentPassword, newPassword, name } = req.body;
  const userId = req.user.id; // 인증 미들웨어에서 추가된 사용자 ID

  try {
      // 사용자 정보 가져오기
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // 현재 비밀번호 확인
      const decodedPassword = Buffer.from(user.password, 'base64').toString('utf8');
      if (currentPassword && decodedPassword !== currentPassword) {
          return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // 새 비밀번호 암호화 후 저장
      if (newPassword) {
          user.password = Buffer.from(newPassword).toString('base64');
      }

      // 이름 업데이트
      if (name) {
          user.name = name;
      }

      // 사용자 정보 저장
      await user.save();

      res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 사용자 정보 조회
exports.getProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password'); // 비밀번호 제외
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 사용자 계정 삭제
exports.deleteProfile = async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};
