import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({

    DPIOwner: {

        type: Number,
        required: [true, "DPI Owner is required"],
        unique: true

    },

    no_Account_Owner: {

        type: String,
        required: [true, "No Account Owner is required"],
        unique: true

    },

    DPIDestination: {

        type: Number,
        required: [true, "DPI Destination is required"],
        unique: true

    },

    no_Account_Destination: {


        type: String,
        required: [true, "No Account Destination is required"],
        unique: true

    },

    amount: {

        type: Number,
        required: [true, "Amount is required"],
        unique: true

    },

    description: {

        type: String,
        required: [true, "Description is required"],

    },

    status: {

        type: Boolean,
        default: true

    }

});

export default mongoose.model("History", HistorySchema)