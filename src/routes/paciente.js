const express = require("express");
const Paciente = require("../models/pacienteModel");
const router = express.Router();

// Crear registro de características
router.post("/", async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.status(201).json(paciente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todas las características
router.get("/", async (req, res) => {
  const paciente = await Paciente.find();
  res.json(paciente);
});

// Actualizar características
router.put("/:id", async (req, res) => {
  try {
    const updated = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar características
router.delete("/:id", async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ message: "Registro de características eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;