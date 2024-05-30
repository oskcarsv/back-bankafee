import mongoose from "mongoose";

const statusSchema = mongoose.Schema({

    userStatus: {

        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED']
        
    }

});

export default mongoose.model('Status', statusSchema)