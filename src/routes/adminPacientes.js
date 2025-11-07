const express = require("express");
const mongoose = require("mongoose");
const Paciente = require("../models/pacienteModel");
const { protect } = require("../middleware/authMiddleware");
const { isOwnerOrAdmin, isAdmin } = require("../middleware/roleMiddleware"); //Importar isAdmin

const router = express.Router();

/**
 * Crear nuevo paciente (solo admin)
 */
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.status(201).json(paciente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Obtener todos los pacientes del sistema
 */
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const query = {};

    if (req.query.sexo) query.sexo = req.query.sexo;
    if (req.query.edadMin) query.edad = { $gte: Number(req.query.edadMin) };
    if (req.query.edadMax) {
      query.edad = query.edad || {};
      query.edad.$lte = Number(req.query.edadMax);
    }

    const pacientes = await Paciente.find(query)
      .populate("medico", "nombre email rol")
      .select("-imagenFondoOjo -senalPPG -pdfReport");

    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Obtener paciente por ID
 */
router.get("/:id", protect, isAdmin, async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id).populate("medico", "nombre email rol");
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Resumen sin archivos
 */
router.get("/:id/summary", protect, isAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const paciente = await Paciente.findById(req.params.id)
      .select("-imagenFondoOjo -senalPPG -pdfReport")
      .populate("medico", "nombre email rol");

    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Actualizar información general
 */
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const updated = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Eliminar paciente (solo admin)
 */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ message: "Paciente eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
