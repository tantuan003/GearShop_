// controllers/UserController.js
import jwt from 'jsonwebtoken';
import {UserModel} from '~/models/UserModel'; // Import mô hình người dùng
import Joi from 'joi'; 
import { StatusCodes } from 'http-status-codes'; // Đảm bảo đã import StatusCodes
import bcrypt from 'bcrypt'
import Product from '~/models/ProductModel';
import Category from '~/models/CategoryModel';
import upload from '~/config/multerConfig';
import path from 'path';
import mongoose from 'mongoose';


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
// API thêm sản phẩm
export const addProduct = async (req, res) => {
    try {
        // Sử dụng multer để xử lý ảnh
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Lỗi khi tải ảnh lên: ' + err.message });
            }
            // Lấy thông tin từ body và ảnh từ multer
            const { name, description, price, stock, category} = req.body;
            const image = `/Upload/${req.file.filename}`  // Lấy đường dẫn ảnh đã tải lên
            
            const newProduct = new Product({
                name,
                description,
                price,
                stock,
                image,
                category // Gán categoryId vào trường category
            });
            await newProduct.save();

            
            res.status(201).json(newProduct); 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy id từ URL

        // Tìm và xóa sản phẩm theo id
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ message: 'Sản phẩm đã được xóa' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ.' });
        }

        // In ra ID để kiểm tra
        console.log("ID của danh mục:", id);

        // Kiểm tra xem danh mục có tồn tại hay không
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            console.log(`Không tìm thấy danh mục với ID: ${id}`); // Log nếu không tìm thấy danh mục
            return res.status(404).json({ message: 'Danh mục không tồn tại.' });
        }

        console.log('Danh mục đã được xóa:', category); // Log thông báo xóa thành công
        res.status(200).json({ message: 'Xóa danh mục thành công!' });
    } catch (err) {
        console.error('Lỗi khi xóa danh mục:', err); // Log lỗi chi tiết
        res.status(500).json({ message: 'Lỗi khi xóa danh mục', error: err });
    }
};
export const editProduct = async (req, res) => {
    try {
        // Kiểm tra dữ liệu trong body và file được tải lên
        console.log("Product ID:", req.params.id);  // Kiểm tra ID
        console.log("Request Body:", req.body);    // Kiểm tra request body
        console.log("Uploaded file:", req.file);   // Kiểm tra tệp đã tải lên

        const { name, description, price, stock } = req.body;
        const updatedData = { name, description, price, stock };

        // Kiểm tra và thêm ảnh nếu có
        if (req.file) {
            // Sử dụng path.join để xây dựng đường dẫn tương đối
            const imagePath = path.join('Upload', req.file.filename); 
            updatedData.image = imagePath; // Đường dẫn tương đối đến thư mục Upload
        }

        // Cập nhật sản phẩm trong DB
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật thành công', product: updatedProduct });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Kiểm tra xem danh mục đã tồn tại hay chưa
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Danh mục đã tồn tại.' });
        }

        // Tạo danh mục mới
        const newCategory = new Category({
            name,
            description
        });

        // Lưu danh mục vào database
        await newCategory.save();

        res.status(201).json({
            message: 'Thêm danh mục thành công!',
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi thêm danh mục.',
            error: error.message
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        // Lấy các tham số từ query (page, limit, role)
        const { page = 1, limit = 10, role } = req.query;

        // Tạo điều kiện lọc nếu có `role`
        const filter = role ? { role } : {};

        // Sử dụng phân trang và lọc
        const users = await UserModel.find(filter)
            .skip((page - 1) * limit) // Bỏ qua số lượng bản ghi tương ứng
            .limit(Number(limit));   // Giới hạn số lượng bản ghi trả về

        // Đếm tổng số người dùng (phục vụ phân trang)
        const totalUsers = await UserModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: users,
            totalUsers,
            currentPage: Number(page),
            totalPages: Math.ceil(totalUsers / limit),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
        }
        res.status(200).json({ success: true, message: 'Xóa người dùng thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
