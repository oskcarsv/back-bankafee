import mongoose from "mongoose";

const RolesSchema = mongoose.Schema({
  rolesName: {
    type: String,
    enum: ["USER_ROLE", "ADMIN_ROLE"],
  },
});

export default mongoose.model("Roles", RolesSchema);
