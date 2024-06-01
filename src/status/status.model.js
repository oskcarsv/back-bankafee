import mongoose from "mongoose";

const statusSchema = mongoose.Schema({
  userStatus: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "LOCKED", "SUSPENDED"],
  },

  clientPetitionStatus: {
    type: String,
    enum: ["IN-PROCESS", "APPROVED", "REJECTED"],
  },
});

export default mongoose.model("Status", statusSchema);
