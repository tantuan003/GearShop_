// models/CategoryModel.js

const mongoose = require('mongoose');

// Định nghĩa schema cho Category
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // bắt buộc phải có tên
    },
    description: {
        type: String,
        required: true, // bắt buộc phải có mô tả
    },
});

// Tạo model Category từ schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
