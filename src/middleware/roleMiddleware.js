// Solo administrador
const isAdmin = (req, res, next) => {
  if (req.user.rol === "Administrador") return next();
  return res.status(403).json({ message: "Acceso denegado: solo Administrador" });
};

// Médico o administrador
const isMedicoOrAdmin = (req, res, next) => {
  if (req.user.rol === "Medico" || req.user.rol === "Administrador") return next();
  return res.status(403).json({ message: "Acceso denegado: requiere rol Médico o Administrador" });
};

// Verifica si el usuario es dueño del recurso o admin
const isOwnerOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);
      if (!ownerId) return res.status(404).json({ message: "Recurso no encontrado" });

      if (req.user.rol === "Administrador" || req.user._id.toString() === ownerId.toString()) {
        return next();
      }

      return res.status(403).json({ message: "No tienes permiso para esta acción" });
    } catch (err) {
      return res.status(500).json({ message: "Error de permisos", error: err.message });
    }
  };
};

module.exports = { isAdmin, isMedicoOrAdmin, isOwnerOrAdmin };
