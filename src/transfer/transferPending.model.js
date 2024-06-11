import { Schema, model } from 'mongoose'

const TransferPendingSchema = new Schema({
    transfer: {
        type: Object
    }
});

export default model('TransferPending', TransferPendingSchema)