import { Schema, model } from "mongoose";

const AccountSchema = Schema({
  type: {
    type: String,
    enum: ["SAVINGS", "CURRENT", "CREDIT"],
    required: [true, "Type of account is required"],
  },
  noAccount: {
    type: String,
    required: [true, "Number of account is required"],
  },
  DPI_Owner: {
    type: Number,
    required: [true, "DPI of the owner is required"],
  },
  alias: {
    type: String,
    required: [true, "Alias of the account is required"],
  },
  amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default model("Account", AccountSchema);
