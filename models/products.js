import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    productID: { type: String, unique: true },
    productName: { type: String},
    productPrice: {
        type: Number,
        required: true,
        min: 0
    },
    productDisPrice: {
        type: Number,
        required: true,
        min: 0
    },
    productDiscount: Number,
    ProductDes: [String],
    category: String,
    brand: String,
    images: [String],
    quantity: {
        type: Number,
        required: true,
        min: 0
    },      
    
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', userSchema);

export default Product;