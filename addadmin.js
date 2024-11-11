// addAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Sử dụng bcryptjs để mã hóa mật khẩu
import { CONNECT_DB } from './src/config/mongodb.js'; // Đảm bảo đường dẫn đúng
import { UserModel } from './src/models/UserModel.js'; // Đảm bảo đường dẫn đúng

// Kết nối MongoDB
CONNECT_DB()
    .then(async () => { // Thêm async để sử dụng await bên trong
        console.log('Connected to MongoDB');

        try {
            // Mã hóa mật khẩu
            const passwordHash = await bcrypt.hash('033561', 10);

            // Tạo tài khoản admin mới
            const admin = new UserModel({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: passwordHash,
                role: 'admin'  // Đảm bảo role là 'admin'
            });

            // Lưu tài khoản admin vào MongoDB
            await admin.save();
            console.log('Admin account created successfully');
        } catch (err) {
            console.error('Error creating admin account:', err);
        } finally {
            mongoose.connection.close(); // Đóng kết nối
        }
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
