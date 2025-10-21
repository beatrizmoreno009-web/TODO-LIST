const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Proteger rutas con JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-contraseña");
      if (!req.user) return res.status(401).json({ message: "Usuario no encontrado" });
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  if (!token) return res.status(401).json({ message: "No se proporcionó token" });
};

module.exports = { protect };
