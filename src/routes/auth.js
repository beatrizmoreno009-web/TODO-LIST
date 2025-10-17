const express = require("express");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Registrar usuario (solo administrador debería poder crear usuarios en producción)
router.post("/register", async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ message: "Faltan datos" });
  }
  const existe = await User.findOne({ email });
  if (existe) {
    return res.status(400).json({ message: "Usuario ya existe" });
  }
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(contraseña, salt);

  const user = await User.create({
    nombre,
    email,
    contraseña: hashed,
    rol: rol || "Usuario",
  });
  const token = generateToken(user);
  res.status(201).json({
    _id: user._id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    token,
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  const bcrypt = require("bcryptjs");
  const valid = await bcrypt.compare(contraseña, user.contraseña);
  if (!valid) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  const token = generateToken(user);
  res.json({
    _id: user._id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    token,
  });
});

// (Opcional) Logout: en JWT no se “invalida” en servidor fácilmente, es más bien borrar el token en cliente
router.post("/logout", protect, (req, res) => {
  // Solo para cumplir semánticamente
  res.json({ message: "Logout exitoso. Borra el token en el cliente." });
});

module.exports = router;
