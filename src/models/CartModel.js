import mongoose from 'mongoose';

// Định nghĩa Cart schema
const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }]
});

// Tạo model Cart từ schema
const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
