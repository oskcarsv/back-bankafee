import {Schema, model} from 'mongoose'

const DespositPendingSchema = Schema({
    deposit:{
        type:Object,
    }
})

export default model('DespositPendients',DespositPendingSchema);