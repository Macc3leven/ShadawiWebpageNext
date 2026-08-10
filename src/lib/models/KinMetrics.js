import mongoose from "mongoose";

const KinMetricsSchema = new mongoose.Schema({
  type:    { type: String, default: "Kin" },
  sid:     Number,
  tokenId: { type: String, required: true, unique: true },
  // Identity
  kinName:       String,
  currentForm:   Number,
  formStage:     String,
  className:     String,
  rarity:        String,
  // Ownership
  owner:            String,
  ownedSince:       Date,
  previousOwners:   Number,
  transferCount:    Number,
  listedForSale:    Boolean,
  // Progression
  level:          Number,
  xp:             Number,
  xpToNextLevel:  Number,
  purgLevel:      String,
  evolutionReady: Boolean,
  // Battle
  battles:      Number,
  losses:       Number,
  winRate:      String,
  damageDealt:  Number,
  damageTaken:  Number,
  highestDamage:Number,
  battleRank:   Number,
  lastBattle:   Date,
  // Rewards
  gemsConsumed: Number,
  rareDrops:    [String],
  // Misc
  condition:    String,
  openseaUrl:   String,
});

export default mongoose.models.KinMetrics || mongoose.model("KinMetrics", KinMetricsSchema);
