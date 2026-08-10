import mongoose from "mongoose";

// Shared base fields for all ability variants
const baseFields = {
  abilityId:   { type: String, required: true, unique: true },
  clipId:      String,
  abilityKind: { type: String, enum: ["strike", "projectile", "defense", "alter"], required: true },
  costType:    { type: String, enum: ["essence", "sp"] },
  costValue:   Number,
  name:        String,
  description: String,
};

// Strike
const StrikeSchema = new mongoose.Schema({
  ...baseFields,
  abilityKind: { type: String, default: "strike" },
  atk: Number,
  def: Number,
}, { discriminatorKey: "abilityKind" });

// Projectile
const ProjectileSchema = new mongoose.Schema({
  ...baseFields,
  abilityKind: { type: String, default: "projectile" },
  atk: Number,
});

// Defense
const DefenseSchema = new mongoose.Schema({
  ...baseFields,
  abilityKind: { type: String, default: "defense" },
  def: Number,
});

// Alter
const AlterSchema = new mongoose.Schema({
  ...baseFields,
  abilityKind: { type: String, default: "alter" },
  trigger:    String,
  targeting:  String,
  conditions: [String],
  effects:    [{ type: mongoose.Schema.Types.Mixed }],
});

const AbilitySchema = new mongoose.Schema({
  ...baseFields,
  atk:        Number,
  def:        Number,
  trigger:    String,
  targeting:  String,
  conditions: [String],
  effects:    [{ type: mongoose.Schema.Types.Mixed }],
  stats:      [{ name: String, value: mongoose.Schema.Types.Mixed }],
}, { discriminatorKey: "abilityKind" });

export default mongoose.models.Ability || mongoose.model("Ability", AbilitySchema);
