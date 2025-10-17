const express = require("express");
const mongoose = require("mongoose");
const Paciente = require("../models/pacienteModel");
const { protect } = require("../middleware/authMiddleware");
const { isOwnerOrAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// Crear nuevo paciente — cualquier médico autenticado puede registrar pacientes
router.post("/", protect, async (req, res) => {
  try {
    // Asignar el médico que lo registra
    req.body.medico = req.user._id;
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.status(201).json(paciente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los pacientes (solo info médica, sin archivos)
// — solo usuarios autenticados pueden ver la lista (o admin)
router.get("/", protect, async (req, res) => {
  try {
    const query = {};

    // Si el usuario NO es admin, solo ver sus propios pacientes
    if (req.user.rol !== "Administrador") {
      query.medico = req.user._id;
    }

    // Puedes agregar filtros desde query
    if (req.query.sexo) query.sexo = req.query.sexo;
    if (req.query.edadMin) query.edad = { $gte: Number(req.query.edadMin) };
    if (req.query.edadMax) {
      query.edad = query.edad || {};
      query.edad.$lte = Number(req.query.edadMax);
    }
    if (req.query.diabetes === "true") query["enfermedades.diabetes"] = true;

    const pacientes = await Paciente.find(query)
      .select("-imagenFondoOjo -senalPPG -pdfReport");
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener todos los datos de un paciente — solo si eres admin o el médico asignado
router.get("/:id", protect, isOwnerOrAdmin(async (req) => {
  const paciente = await Paciente.findById(req.params.id);
  return paciente ? paciente.medico : null;
}), async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id).populate("medico", "nombre email rol");
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resumen del paciente, sin archivos — solo si eres admin o médico asignado
router.get("/:id/summary", protect, isOwnerOrAdmin(async (req) => {
  const paciente = await Paciente.findById(req.params.id);
  return paciente ? paciente.medico : null;
}), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const paciente = await Paciente.findById(req.params.id)
      .select("-imagenFondoOjo -senalPPG -pdfReport")
      .populate("medico", "nombre email rol");
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar información general del paciente — solo admin o médico asignado
router.put("/:id", protect, isOwnerOrAdmin(async (req) => {
  const paciente = await Paciente.findById(req.params.id);
  return paciente ? paciente.medico : null;
}), async (req, res) => {
  try {
    const updated = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar paciente — solo admin o médico asignado
router.delete("/:id", protect, isOwnerOrAdmin(async (req) => {
  const paciente = await Paciente.findById(req.params.id);
  return paciente ? paciente.medico : null;
}), async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ message: "Paciente eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
