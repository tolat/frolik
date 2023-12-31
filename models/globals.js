const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GlobalsSchema = new Schema(
  {
    type: String,
    categoryColorMap: Object,
    statusMap: Object,
    instructionTypes: Array,
  },
  { minimize: false }
);

module.exports = mongoose.model("Globals", GlobalsSchema);
