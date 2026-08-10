import mongoose from "mongoose";

const CategoryEntrySchema = new mongoose.Schema({
  key:   String,
  label: String,
  value: mongoose.Schema.Types.Mixed,
}, { _id: false });

const MetricsCategorySchema = new mongoose.Schema({
  name:    String,
  entries: [CategoryEntrySchema],
}, { _id: false });

const SpecimenMetricsSchema = new mongoose.Schema({
  type:    { type: String, default: "Specimen" },
  sid:     { type: Number, required: true, unique: true },
  data: [MetricsCategorySchema],
  // Flat convenience fields (population category)
  populationCap:  Number,
  totalMinted:    Number,
  totalBurned:    Number,
  // Ownership category
  uniqueOwners:   Number,
  longestHolder:  String,
  researchTokens: Number,
  // Lineage
  totalForms:     Number,
  supplyPerForm:  String,
  rarestForm:     String,
  popularForm:    String,
  // Battle
  usageRate:      String,
  victories:      Number,
  damageDealt:    String,
  winRate:        String,
  highestStat:    String,
  lowestStat:     String,
  powerIndex:     Number,
  // Blockchain
  openseaUrl:     String,
});

export default mongoose.models.SpecimenMetrics || mongoose.model("SpecimenMetrics", SpecimenMetricsSchema);
