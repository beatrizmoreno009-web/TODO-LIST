const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  fecha_creacion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Dataset", datasetSchema);