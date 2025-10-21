const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// Listar todos los médicos
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const medicos = await User.find({ rol: "Medico" }).select("-contraseña");
    res.json(medicos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo médico
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const hashed = await bcrypt.hash(contraseña, 10);

    const medico = new User({
      nombre,
      email,
      contraseña: hashed,
      rol: "Medico",
    });

    await medico.save();

    const medicoResponse = medico.toObject();
    delete medicoResponse.contraseña;

    res.status(201).json(medicoResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar médico
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    const updateData = { nombre, email };

    if (contraseña) {
      updateData.contraseña = await bcrypt.hash(contraseña, 10);
    }

    const updatedMedico = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-contraseña");

    if (!updatedMedico) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json(updatedMedico);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar médico
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const deletedMedico = await User.findByIdAndDelete(req.params.id);

    if (!deletedMedico) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json({ message: "Médico eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
