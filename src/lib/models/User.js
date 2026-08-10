import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:   { type: String },                           // set after profile creation
  username:       { type: String, unique: true, sparse: true, trim: true },
  walletAddress:  { type: String, sparse: true },
  emailVerified:  { type: Boolean, default: false },
  otpCode:        { type: String },                           // hashed 6-digit code
  otpExpires:     { type: Date },
  createdAt:      { type: Date, default: Date.now },
});

// Prevent model re-compilation on hot-reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
