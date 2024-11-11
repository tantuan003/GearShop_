// addCategories.js
import { CONNECT_DB } from './src/config/mongodb.js';
import mongoose from 'mongoose'; // Sử dụng import thay vì require
import Product from './src/models/ProductModel.js'; // Đảm bảo thêm .js khi dùng ES Module
import Category from './src/models/CategoryModel.js';

// Hàm async để sử dụng await
async function addCategories() {
    try {
        // Kết nối MongoDB
        await CONNECT_DB();
        console.log('Connected to MongoDB');

        // Tạo dữ liệu Category
        const category = await Category.findOne({ name: 'Bàn Phím' });

        if (!category) {
            console.log('Category not found');
            return mongoose.connection.close();  // Nếu không có danh mục, đóng kết nối
        }

        // Tạo dữ liệu sản phẩm
        const newProduct = new Product({
            name: 'Bàn phím cơ Ximeng X98',
            category: category.name, // Liên kết tới _id của Category
            price: 1250000, // Giá sản phẩm
            description: 'Bàn phím cơ chất lượng cao',
            image: { url: '/src/Public/Upload/keyboard_banner1.png', alt: 'Bàn phím cơ XYZ' }, // Cấu trúc cho trường image
            stock: 50 // Số lượng trong kho
        });

        // Lưu sản phẩm vào MongoDB
        await newProduct.save();
        console.log('Product added successfully');
    } catch (err) {
        console.error('Error adding product:', err);
    } finally {
        mongoose.connection.close(); // Đóng kết nối
    }
}

// Gọi hàm async
addCategories();
