import mongoose from "mongoose";

const ReferenceSchema = new mongoose.Schema({
  type: { type: String, enum: ["ipfs", "cloud"] },
  url: String,
  contentType: { type: String, enum: ["basemodel", "animation", "metadata.json"] },
  file: {
    path: String,
    name: String,
    size: Number,
    hash: String,
    format: { type: String, default: "glb" },
  },
}, { _id: false });

const AbilityRefSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["strike", "projectile", "defense", "alter"] },
  description: String,
  cost: {
    type: { type: String, enum: ["essence", "sp"] },
    value: Number,
  },
  stats: [{ name: String, value: mongoose.Schema.Types.Mixed }],
}, { _id: false });

const AttributeSchema = new mongoose.Schema({
  name: { type: String, enum: ["className", "purgLvl", "build", "size"] },
  value: String,
}, { _id: false });

const StatSchema = new mongoose.Schema({
  name: { type: String, enum: ["health", "essence", "recovery", "speed", "weight"] },
  value: Number,
  max: Number,
}, { _id: false });

const SpecimenSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  sid:         { type: Number, required: true, unique: true },
  description: String,
  creator:     String,
  population:  Number,
  currentForm: { type: Number, default: 0 },
  maxForm:     { type: Number, default: 1 },
  references:  [ReferenceSchema],
  abilities:   [AbilityRefSchema],
  attributes:  [AttributeSchema],
  stats:       [StatSchema],
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Specimen || mongoose.model("Specimen", SpecimenSchema);
