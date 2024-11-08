import express from 'express';
import { CreateUser,LoginUser,getUserProfile,logout} from '~/controllers/UserController'
import { CreateUser_validition } from '~/validations/UserValidation';
import authMiddleware from '~/middlewares/LoginMiddleware';
import Category from '~/models/CategoryModel'; // Hoặc đường dẫn đúng tới model Category



const router = express.Router();

router.post('/register',CreateUser_validition,CreateUser);

router.post('/login',LoginUser)
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
export const UserRoutes = router;
