const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

// Crear usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    if (!nombre || !email || !contraseña)
      return res.status(400).json({ message: "Faltan campos requeridos" });

    const user = new User({ nombre, email, contraseña, rol });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;