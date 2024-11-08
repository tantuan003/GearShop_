import express from 'express';
import cors from 'cors';
import path from 'path'; // Thêm dòng này
import cookieParser from 'cookie-parser';
import { CONNECT_DB, GET_DB } from '~/config/mongodb';
import { APIs_V1 } from '~/routes/v1'; // Điều chỉnh theo cấu trúc thư mục của bạn
import dotenv from 'dotenv';

const START_SERVER = () => {
  const app = express();
  const hostname = 'localhost';
  const port = 8127;
  dotenv.config();
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public'))); // Đảm bảo đường dẫn chính xác

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'WellCome.html'));
  });

  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
  });
  app.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.status(200).json({ message: 'Đăng xuất thành công' });
    
  });
  app.use('/v1', APIs_V1);
  app.listen(port, hostname, () => {
    console.log(`Hello Nguyen Tan Tuan, I am running at http://${hostname}:${port}/`);
  });
};

// Kết nối database và khởi động server
CONNECT_DB()
  .then(() => console.log('Connected to database'))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(0); // Dừng server nếu không kết nối được DB
  });


