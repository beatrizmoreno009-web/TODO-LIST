const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No autorizado, token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-contraseña");
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = { protect };
