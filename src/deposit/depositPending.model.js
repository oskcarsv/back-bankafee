import {Schema, model} from 'mongoose'

const DepositPendingSchema = Schema({
    deposit:{
        type:Object,
    }
})

export default model('DepositPending',DepositPendingSchema);