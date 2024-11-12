import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:true, // bắt buộc phải có tên
    },
    category: { type: String, required: true },
    price:{
        type: Number,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: false

    },
    image:{
        type:Object,
        required:false

    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },

    
});
const Product = mongoose.model('Product', productSchema);

export default  Product;
   
