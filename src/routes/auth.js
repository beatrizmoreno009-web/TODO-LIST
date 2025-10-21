const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

// Generar token JWT
const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

// Registrar nuevo usuario (solo Admin puede crear médicos)
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "Email ya registrado" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(contraseña, salt);

    const user = new User({ nombre, email, contraseña: hashed, rol });
    await user.save();

    res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token: generarToken(user._id, user.rol),
    });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar usuario", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(contraseña, user.contraseña))) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        token: generarToken(user._id, user.rol),
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message });
  }
});

module.exports = router;
