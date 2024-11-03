import express from 'express';
import { CreateUser} from '~/controllers/UserController'
import{UserValidation} from '~/validations/UserValidation'

const router = express.Router();

router.post('/register', CreateUser);



export const UserRoutes = router;
