// routes/medico.js
const express = require("express");
const User = require("../models/userModel");
const Paciente = require("../models/pacienteModel");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const bcrypt = require("bcryptjs");

const router = express.Router();

/* =============================
   GET - Listar todos los médicos
   ============================= */
router.get("/", protect, isAdmin, async (req, res) => {
  const medicos = await User.find({ rol: "Medico" }).select("-contraseña");
  res.json(medicos);
});

/* =============================
   POST - Crear un médico
   ============================= */
router.post("/", protect, isAdmin, async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  const existe = await User.findOne({ email });
  if (existe) {
    return res.status(400).json({ message: "Email ya registrado" });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const medico = new User({ nombre, email, contraseña: hashedPassword, rol: "Medico" });

  await medico.save();

  const medicoResponse = medico.toObject();
  delete medicoResponse.contraseña;

  res.status(201).json(medicoResponse);
});

/* =============================
   PUT - Editar un médico
   ============================= */
router.put("/:id", protect, isAdmin, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-contraseña");

  if (!updated) return res.status(404).json({ message: "Médico no encontrado" });
  res.json(updated);
});

/* =============================
   DELETE - Eliminar un médico
   ============================= */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  const eliminado = await User.findByIdAndDelete(req.params.id);
  if (!eliminado) return res.status(404).json({ message: "Médico no encontrado" });
  res.json({ message: "Médico eliminado correctamente" });
});

/* =============================
   GET - Ver pacientes de un médico
   ============================= */
router.get("/:id/pacientes", protect, isAdmin, async (req, res) => {
  const pacientes = await Paciente.find({ medico: req.params.id });
  res.json(pacientes);
});

module.exports = router;
