import {Schema, model} from "mongoose";

const AccountPetitionSchema = new Schema({

    noPetition: {
        type: Number,
        required: [true, "Number of petition is required"],
        unique: true,
    },
    type: {
        type: String,
        enum: ["SAVINGS", "CURRENT", "CREDIT"],
        required: [true, "Type of account is required"],
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
        type: String,
        enum: ["IN-PROCESS", "APPROVED", "REJECTED"],
        default: "IN-PROCESS",
      },    

});

export default model("AccountPetition", AccountPetitionSchema)