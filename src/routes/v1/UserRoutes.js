import express from 'express';
import { CreateUser, LoginUser, getUserProfile, logout, addProduct, deleteProduct, editProduct,addCategory,deleteCategory,getAllUsers,deleteUser,editUser,getProductsByCategoryId } from '~/controllers/UserController'; // Import editProduct
import { CreateUser_validition } from '~/validations/UserValidation';
import authMiddleware from '~/middlewares/LoginMiddleware';
import Category from '~/models/CategoryModel';
import Product from '~/models/ProductModel';
import { UserModel } from '~/models/UserModel';
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
        const formattedProducts = products.map(product => {
            // Chỉ cập nhật trực tiếp trường cần định dạng mà không tạo đối tượng mới
            return {
                ...product.toObject(), // Giữ nguyên kiểu dữ liệu gốc
                price: product.price.toLocaleString('vi-VN') // Định dạng trường price
            };
        });

        res.status(200).json(formattedProducts);
        
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
router.delete('/delete-category/:id', authMiddleware, deleteCategory);
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
router.get('/finduser/:userid', async (req, res) => {
    try {
        const { userid } = req.params;  // Lấy ID từ URL
        const user = await UserModel.findById(userid);  // Tìm sản phẩm theo ID

        if (!user) {
            return res.status(404).json({ message: 'không tìm thấy người dùng' });
        }

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
router.get('/getalluser', getAllUsers);
router.delete('/delete-user/:id', deleteUser);
// Route để chỉnh sửa sản phẩm
router.put('/edit/:id', upload.single('image'), editProduct);

router.put('/edit-user/:id', editUser);
router.post('/addcategory',addCategory)
router.get('/category/id/:categoryId', getProductsByCategoryId);
export const UserRoutes = router;
