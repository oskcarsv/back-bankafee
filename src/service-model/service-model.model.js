import mongoose, { Schema } from "mongoose";

const ServiceModelSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  enterprise: {
    type: String,
    required: true,
  },
  discountCode: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("serviceModel", ServiceModelSchema);
