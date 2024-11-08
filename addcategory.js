// addCategories.js
import { CONNECT_DB } from './src/config/mongodb.js';
import mongoose from 'mongoose'; // Sử dụng import thay vì require
import Category from './src/models/CategoryModel.js'; // Đảm bảo thêm .js khi dùng ES Module

// Kết nối MongoDB
CONNECT_DB()
    .then(() => {
        console.log('Connected to MongoDB');
        // Tạo dữ liệu Category
        const categories = [
            { name: 'Bàn Phím', description: 'Bàn phím tốt' },
            { name: 'Chuột Máy Tính', description: 'Chuột ngon' },
            { name: 'Tai Nghe', description: 'Tai nghe xịn' },
            { name: 'Pad Chuột', description: 'pad chuột siêu mượt' }
        ];

        // Lưu các category vào MongoDB
        Category.insertMany(categories)
            .then(() => {
                console.log('Categories added successfully');
                mongoose.connection.close();
            })
            .catch(err => {
                console.error('Error adding categories:', err);
                mongoose.connection.close();
            });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
