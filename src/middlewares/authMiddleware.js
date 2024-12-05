const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer 뒤의 토큰 추출
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET 사용
    req.user = decoded; // decoded 정보 저장
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" }); // 오류 메시지 반환
  }
};

module.exports = authMiddleware;
