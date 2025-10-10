const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ["Administrador", "Usuario"], default: "Usuario" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
