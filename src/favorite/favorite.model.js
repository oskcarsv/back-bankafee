import mongoose from "mongoose";

const favoriteSchema = mongoose.Schema({
    noOwnerAccount: {
        type: String,
        required: [true, "No Account Owner is required"],
    },

    favorites: [
        {
            alias: {
                type: String,
                required: [true, "Alias of the account is required"],
            },
            noAccount: {
                type: String,
                required: [true, "Number of account is required"],
            },
        },
    ],

    status: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model("Favorite", favoriteSchema)