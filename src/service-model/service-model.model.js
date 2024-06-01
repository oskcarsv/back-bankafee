import mongoose, { Schema } from "mongoose";

const ServiceModelSchema = new Schema({
    tittle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categoryService',
        required: true,
    },
    discountCode: {
        type: String,
    },
    img: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model('serviceModel', ServiceModelSchema);