import mongoose from "mongoose";

// Kin = individual NFT instance of a Specimen
const KinSchema = new mongoose.Schema({
  tokenId:     { type: String, required: true, unique: true },
  sid:         { type: Number, required: true },  // parent Specimen
  name:        String,
  currentForm: { type: Number, default: 0 },
  currentSkin: String,
  owner:       String, // wallet address or username
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Kin || mongoose.model("Kin", KinSchema);
