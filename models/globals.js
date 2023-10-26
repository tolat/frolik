const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GlobalsSchema = new Schema(
  {
    categoryColorMap: Object,
    statusMap: Object,
    cityData: Object
  },
  { minimize: false }
);

module.exports = mongoose.model("Globals", GlobalsSchema);
