import express from 'express';
import { CreateUser,LoginUser,getUserProfile,logout} from '~/controllers/UserController'
import { CreateUser_validition } from '~/validations/UserValidation';
import authMiddleware from '~/middlewares/LoginMiddleware';


const router = express.Router();

router.post('/register',CreateUser_validition,CreateUser);

router.post('/login',LoginUser)
router.post('/logout',logout);
router.get('/logged_in',authMiddleware)
export const UserRoutes = router;
