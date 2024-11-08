import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

export const CreateUser_validition = async (req, res, next) => {
    console.log(req.body);

    const correctCondition = Joi.object({
        name: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(3).max(50).trim().strict(),
        email: Joi.string().email().required().min(3).max(50).trim().strict(),
    });

    try {
        await correctCondition.validateAsync(req.body);
        next(); // Pass control to the next middleware without sending a response here
    } catch (error) {
        console.error(error); // Log the error
        res.status(StatusCodes.BAD_REQUEST).json({
            errors: error.details.map((err) => err.message),
        }); // Send validation error response if validation fails
    }
};

export default CreateUser_validition;
