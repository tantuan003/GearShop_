import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes'; 

// Middleware kiểm tra token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      return res.redirect('/login.html'); 
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      // Nếu token không hợp lệ, chuyển hướng đến trang đăng nhập
      return res.redirect('/login.html');
    }
};
export default authMiddleware;
