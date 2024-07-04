import { Schema, model } from "mongoose";

const TransferSchema = Schema({
  noOwnerAccount: {
    type: String,
    required: [true, "No Account Owner is required"],
  },
  noDestinationAccount: {
    type: String,
    required: [true, "No Destination Account is required"],
  },
  DPI_DestinationAccount: {
    type: Number,
    required: [true, "DPI Destination Account is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  dateTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["CANCELED", "COMPLETED"],
  },
});
export default model("Transfer", TransferSchema);
