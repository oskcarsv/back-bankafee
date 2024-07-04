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

  creditStatus: {
    type: String,
    enum: ["IN-PROCESS", "APPROVED", "REJECTED", "PAID"],
  },
});

export default mongoose.model("Status", statusSchema);
