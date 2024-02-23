const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  entries: {
    type: Array,
    required: true,
  },
  entryDate: {
    type: String,
    require: true,
  },
  fatigueEntry: {
    type: String,
    require: true,
  },
  mood: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  "health-notes":{
    type: String,
    required: true,
  },
  "journal-lang":{
    type: String,
    required: true,
  },
  "journal-user":{
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  privateMode: {
    type: Boolean,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reactions: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  visualTotals: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Journal", JournalSchema);