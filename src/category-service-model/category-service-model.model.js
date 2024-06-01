import mongoose, { Schema } from "mongoose";

const CategoryServiceModelSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Status: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model('categoryService', CategoryServiceModelSchema);