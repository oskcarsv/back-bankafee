import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: 
    {
        type: String,
        required: [true, 'Name is required']
    },
    description: 
    {
        type: String,
        required: [true, 'Description is required']
    },
    price: 
    {
        type: Number,
        required: [true, 'Price is required']
    },
    category: 
    {
        type: String,
        required: [true, 'Category is required']
    }, 
    stock: 
    {
        type: Number,
        required: [true, 'Stock is required']
    },
    //img: 
    //{
    //    type: String,
    //    required: [true, 'Image is required']
    //},
    status:
    {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('Product', productSchema);