const express = require("express");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Crear usuario (solo administrador)
router.post("/", protect, isAdmin, async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }
  const existe = await User.findOne({ email });
  if (existe) {
    return res.status(400).json({ message: "Email ya registrado" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(contraseña, salt);

  const user = new User({ nombre, email, contraseña: hashed, rol });
  await user.save();
  const userResponse = user.toObject();
  delete userResponse.contraseña;

  res.status(201).json(userResponse);
});

// Obtener todos los usuarios (solo admin)
router.get("/", protect, isAdmin, async (req, res) => {
  const users = await User.find().select("-contraseña");
  res.json(users);
});

// Actualizar usuario (solo admin)
router.put("/:id", protect, isAdmin, async (req, res) => {
  // Podrías permitir que el usuario se actualice a sí mismo, pero aquí lo dejamos solo admin
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-contraseña");
  if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(updated);
});

// Eliminar usuario (solo admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado correctamente" });
});

module.exports = router;
