import { Schema, model } from 'mongoose';

const AccountSchema = Schema({
    type:{
        type: String,
        required: true
    },
    DPI_Owner: {
        type: Number,
        required: true
    },
    alias:{ 
        type: String,
        required: true
    },
    amout:{
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
});

AccountSchema.methods.toJSON=function(){
    const { __v, _id, ...account } = this.toObject();
    this.id = _id;
    return account;
}

export default model('Account', AccountSchema, 'accounts');