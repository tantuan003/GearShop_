// models/UserModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'],  // Chỉ cho phép giá trị 'user' hoặc 'admin'
        default: 'user'  // Mặc định là 'user' nếu không điền
    },
});

export const UserModel = mongoose.model('users', userSchema);

