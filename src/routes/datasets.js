const express = require("express");
const Dataset = require("../models/datasetModel");
const router = express.Router();

// Crear dataset
router.post("/", async (req, res) => {
  try {
    const dataset = new Dataset(req.body);
    await dataset.save();
    res.status(201).json(dataset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los datasets
router.get("/", async (req, res) => {
  const datasets = await Dataset.find();
  res.json(datasets);
});

// Actualizar dataset
router.put("/:id", async (req, res) => {
  try {
    const updated = await Dataset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar dataset
router.delete("/:id", async (req, res) => {
  try {
    await Dataset.findByIdAndDelete(req.params.id);
    res.json({ message: "Dataset eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;