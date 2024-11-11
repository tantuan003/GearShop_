import express from 'express';
import { CreateUser,LoginUser,getUserProfile,logout} from '~/controllers/UserController'
import { CreateUser_validition } from '~/validations/UserValidation';
import authMiddleware from '~/middlewares/LoginMiddleware';
import Category from '~/models/CategoryModel'; // Hoặc đường dẫn đúng tới model Category
import Product from '~/models/ProductModel'; // Hoặc đường dẫn đúng tới model Category
import { StatusCodes } from 'http-status-codes';
import path from 'path'; 


const router = express.Router();

router.post('/register',CreateUser_validition,CreateUser);

router.post('/login',LoginUser,authMiddleware,getUserProfile)
router.post('/logout',logout);
router.get('/logged_in',authMiddleware)
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
        return res.sendFile(path.join(__dirname,'..', '..', 'Public', 'admin.html'));
    } else {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Bạn không có quyền truy cập vào trang admin' });
    }
});
export const UserRoutes = router;
