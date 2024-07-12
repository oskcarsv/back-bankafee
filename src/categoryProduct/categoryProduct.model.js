import mongoose from "mongoose";

const categoryProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  img: {
    type: String,
    required: [true, "Image is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("CategoryProduct", categoryProductSchema);
