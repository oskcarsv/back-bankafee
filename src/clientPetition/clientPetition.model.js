import mongoose from "mongoose";

const ClientPetitionSchema = mongoose.Schema({

    no_Petition: {

        type: Number,
        required: [true, 'Petition number is required'],
        unique: true

    },

    name: {

        type: String,
        required: [true, 'Name is required']

    },

    username: {

        type: String,
        required: [true, 'Username is required'],
        unique: true

    },

    DPI: {

        type: Number,
        required: [true, 'DPI is required'],
        unique: true

    },

    email: {

        type: String,
        required: [true, 'Email is required'],
        unique: true

    },

    phoneNumber: {

        type: String,
        required: [true, 'Phone number is required'],

    },

    workPlace: {

        type: String,
        required: [true, 'Work place is required']

    },

    monthlyIncome: {

        type: Number,
        required: [true, 'Monthly income is required']

    },

    status: {

        type: String,
        enum: ['IN-PROCESS', 'APPROVED', 'REJECTED'],

    }

});

export default mongoose.model('ClientPetition', ClientPetitionSchema)