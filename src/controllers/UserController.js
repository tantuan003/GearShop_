// controllers/UserController.js
import { GET_DB } from '~/config/mongodb'; // Thay đổi đường dẫn cho phù hợp

import { UserModel } from '~/models/UserModel'; // Import mô hình người dùng
import Joi from 'joi'; 
import { StatusCodes } from 'http-status-codes'; // Đảm bảo đã import StatusCodes

export const CreateUser = async (req, res, next) => {
    console.log(req.body); // Kiểm tra dữ liệu đầu vào

    const correctCondition = Joi.object({
        name: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(3).max(50).trim().strict(),        
        email: Joi.string().email().required().min(3).max(50).trim().strict(),        
        role: Joi.string().required().min(3).max(50).trim().strict()
    });

    try {
        await correctCondition.validateAsync(req.body);

        // Lấy cơ sở dữ liệu
        const db = GET_DB();
        const userCollection = db.collection('users'); // Thay đổi tên collection nếu cần

        // Tạo một đối tượng người dùng mới
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Lưu ý: bạn nên mã hóa mật khẩu trước khi lưu
            role: req.body.role
        };

        // Lưu người dùng vào cơ sở dữ liệu
        await userCollection.insertOne(user);

        // Trả về phản hồi thành công
        res.status(StatusCodes.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user creation:', error); // Log lỗi chi tiết
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: error.details ? error.details.map(err => err.message) : error.message
        });
    }
};

