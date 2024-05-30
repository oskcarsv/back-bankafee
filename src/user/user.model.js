import mongoose from "mongoose";

const UserSchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, 'Name is required']

    },

    username: {

        type: String,
        required: [true, 'Username is required'],
        unique: true

    },

    no_Account: {

        type: Number,
        required: [true, 'Account number is required'],
        unique: true
    },

    DPI: {

        type: Number,
        required: [true, 'DPI is required'],
        unique: true

    },

    adress: {

        type: String,
        required: [true, 'Adress is required']

    },

    email: {

        type: String,
        required: [true, 'Email is required'],
        unique: true

    },

    password: {

        type: String,
        required: [true, 'Password is required']

    },

    role: {

        type: String,
        required: [true, 'Role is required'],
        default: 'USER_ROLE'

    },

    phoneNumber: {

        type: String,
        required: [true, 'Phone number is required']

    },

    workPlace: {

        type: String,
        required: [true, 'Work place is required']

    },

    monthlyIncome: {

        type: Number,
        required: [true, 'Monthly income is required']

    },

    keyword: {

        type: String,
        required: [true, 'Keyword is required']

    },

    status: {

        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'LOCKED'],
        default: 'ACTIVE'

    }

});

export default mongoose.model('User', UserSchema)