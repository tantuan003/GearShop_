import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

export const CreateUser = async (req, res) => {  
    console.log(req.body); 

    const correctCondition = Joi.object({
        name: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(3).max(50).trim().strict(),        
        email: Joi.string().email().required().min(3).max(50).trim().strict(),        
        role: Joi.string().required().min(3).max(50).trim().strict()
    });

    try {
        await correctCondition.validateAsync(req.body);
        res.status(StatusCodes.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error.details); // Log lỗi chi tiết
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: error.details ? error.details.map(err => err.message) : error.message
        });
    }
};

export default CreateUser;
