import express from 'express';
import { CreateUser, LoginUser, getUserProfile, logout, addProduct, deleteProduct, editProduct } from '~/controllers/UserController'; // Import editProduct
import { CreateUser_validition } from '~/validations/UserValidation';
import authMiddleware from '~/middlewares/LoginMiddleware';
import Category from '~/models/CategoryModel';
import Product from '~/models/ProductModel';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import upload from '~/config/multerConfig';

const router = express.Router();

router.post('/register', CreateUser_validition, CreateUser);
router.post('/add-product', addProduct);
router.post('/login', LoginUser, authMiddleware, getUserProfile);
router.post('/logout', logout);
router.get('/logged_in', authMiddleware);
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy tất cả category từ MongoDB
        res.status(200).json(categories); // Trả về danh sách category dưới dạng JSON
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err });
    }
});
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err });
    }
});
router.get('/admin', authMiddleware, (req, res) => {
    if (req.user.role === 'admin') {
        return res.sendFile(path.join(__dirname, '..', '..', 'Public', 'admin.html'));
    } else {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Bạn không có quyền truy cập vào trang admin' });
    }
});

router.delete('/delete-product/:id', authMiddleware, deleteProduct);

router.get('/find/:productid', async (req, res) => {
    try {
        const { productid } = req.params;  // Lấy ID từ URL
        const product = await Product.findById(productid);  // Tìm sản phẩm theo ID

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        res.json({ product });  // Trả về sản phẩm
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Route để chỉnh sửa sản phẩm
router.put('/edit/:id', upload.single('image'), editProduct);

export const UserRoutes = router;
