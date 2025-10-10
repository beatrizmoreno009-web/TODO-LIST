const express = require("express");
const Feature = require("../models/featureModel");
const router = express.Router();

// Crear registro de características
router.post("/", async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();
    res.status(201).json(feature);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todas las características
router.get("/", async (req, res) => {
  const features = await Feature.find();
  res.json(features);
});

// Actualizar características
router.put("/:id", async (req, res) => {
  try {
    const updated = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar características
router.delete("/:id", async (req, res) => {
  try {
    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: "Registro de características eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;