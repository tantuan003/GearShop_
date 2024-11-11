// controllers/UserController.js
import jwt from 'jsonwebtoken';
import { UserModel } from '~/models/UserModel'; // Import mô hình người dùng
import Joi from 'joi'; 
import { StatusCodes } from 'http-status-codes'; // Đảm bảo đã import StatusCodes
import bcrypt from 'bcrypt'

export const CreateUser = async (req, res) => {
    console.log('Request body:', req.body);

    const correctCondition = Joi.object({
        name: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(3).max(50).trim().strict(),        
        email: Joi.string().email().required().min(3).max(50).trim().strict(),        
    });

    try {
        // Kiểm tra dữ liệu đầu vào
        await correctCondition.validateAsync(req.body);

        // Kiểm tra email đã tồn tại
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            // Nếu email đã tồn tại, gửi phản hồi lỗi và kết thúc hàm bằng return
            return res.status(StatusCodes.CONFLICT).json({ message: 'Email đã được sử dụng' });
        }
        const saltRounds = 10; // Số vòng băm, bạn có thể điều chỉnh theo nhu cầu
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Mã hóa mật khẩu trước khi lưu
        // (Đảm bảo mã hóa mật khẩu ở đây nếu cần thiết)

        // Tạo đối tượng người dùng mới
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await user.save();
        console.log('User created successfully:', user);

        // Trả về phản hồi thành công và kết thúc hàm bằng return
        return res.status(StatusCodes.CREATED).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error during user creation:', error);

        // Trả về phản hồi lỗi duy nhất
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Có lỗi xảy ra trong quá trình tạo người dùng',
            error: error.message
        });
    }
};


export const LoginUser = async (req, res) => {
    const loginCondition = Joi.object({
        email: Joi.string().email().required().trim().strict(),
        password: Joi.string().required().trim().strict()
    });

    try {
        await loginCondition.validateAsync(req.body);

        // Tìm người dùng trong cơ sở dữ liệu
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email hoặc password không chính xác' });
        }

        // So sánh mật khẩu đã mã hóa
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Email hoặc password không chính xác' });
        }


        // Tạo token JWT
        const token = jwt.sign({ userId: user._id,name: user.name,email:user.email,role:user.role},process.env.JWT_SECRET, { expiresIn: '1d' });

        // Lưu token vào cookie
        res.cookie('token', token, {
            httpOnly: false, // Bảo mật token khỏi truy cập JavaScript phía client
            secure: process.env.NODE_ENV === 'production', // Sử dụng HTTPS trong môi trường production
            maxAge: 24 * 60 * 60 * 1000 // Thời gian tồn tại 1 ngày
        });

        // Trả về phản hồi thành công
        res.json({
            message: 'Đăng nhập thành công',
            user: { name: user.name, email: user.email, role: user.role },
            token: token // trả về token nếu cần dùng ở client
        });
        
    } catch (error) {       
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Dữ liệu không hợp lệ'
        });
    }
};
export const getUserProfile = (req, res) => {
    const user = req.user; // Thông tin người dùng đã được giải mã từ token trong middleware
    res.json({
        message: 'Thông tin người dùng',
        user: user // Trả về thông tin người dùng
    });
};
export const logout = (req,res) =>{
   // Xóa token khỏi cookie
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 0 });

  // Trả về thông báo đăng xuất thành công
  return res.status(200).json({ message: 'Đăng xuất thành công!' });


};
