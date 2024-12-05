const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // 정확히 내보낸 함수 가져오기
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const bookmarkRoutes = require('./routes/bookmarks');
const responseMiddleware = require('./middlewares/responseMiddleware');
const adminRoutes = require('./routes/admin');
const setupSwagger = require('./config/swagger');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(responseMiddleware);

// Database 연결 호출
connectDB();

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

app.use('/admin', adminRoutes); // 관리자 API

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Server
const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

setupSwagger(app);
console.log(__dirname + '/../routes/*.js');

