import mongoose from "mongoose";

const CreditSchema = new mongoose.Schema({

    nameOwner: {

        type: String,
        required: [true, "Name of the owner is required"],

    },

    DPIOwner: {

        type: Number,
        required: [true, "DPI of the owner is required"],

    },

    no_Account_Owner: {

        type: String,
        required: [true, "Number of account is required"],

    },

    creditAmount: {

        type: Number,
        required: [true, "Amount is required"],

    },

    creditTime: {

        type: String,
        required: [true, "Time is required"],
        default: "3 month"

    },

    interestRate:{
        type: Number,
        default:0.0
    },

    reazon: {

        type: String,
        required: [true, "Reazon is required"],

    },

    startCreditDate: {

        type: Date,
        default: Date.now
    },

    endCreditDate: {
        type: Date
    },

    status: {

        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"

    }



});

export default mongoose.model("Credit", CreditSchema)