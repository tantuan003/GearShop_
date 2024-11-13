const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Đảm bảo lưu vào đúng thư mục Upload
        const uploadPath = path.join(__dirname, '..', 'Public', 'Upload'); // hoặc đường dẫn thư mục bạn muốn
        cb(null, uploadPath);  // Chỉ định đúng thư mục
    },
    filename: (req, file, cb) => {
        // Đặt tên file khi lưu
        cb(null, Date.now() + path.extname(file.originalname));  // Thêm thời gian để tránh trùng tên file
    }
});

// Cấu hình multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file tối đa là 10MB
    fileFilter: (req, file, cb) => {
        // Chỉ cho phép file ảnh
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file hình ảnh'));
        }
    }
});
module.exports = upload;
