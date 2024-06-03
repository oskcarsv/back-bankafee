import { Schema, model } from "mongoose";

const DepositSchema = Schema({
  noDestinationAccount: {
    type: String,
    required: [true, "No destination account is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum:["COMPLETED","PROCESSING","CANCELED"]
  },
});

export default model("Deposit", DepositSchema);
