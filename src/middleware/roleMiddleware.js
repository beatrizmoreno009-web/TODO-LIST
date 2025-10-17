const isAdmin = (req, res, next) => {
  if (req.user.rol !== "Administrador") {
    return res.status(403).json({ message: "Requiere permiso de Administrador" });
  }
  next();
};

/**
 * isOwnerOrAdmin: comprueba que el usuario autenticado sea el propietario del recurso (médico asignado)
 * o bien un administrador.
 * @param getOwnerIdFromResource función asíncrona que recibe req y retorna el id del propietario
 */
const isOwnerOrAdmin = (getOwnerIdFromResource) => async (req, res, next) => {
  if (req.user.rol === "Administrador") {
    return next();
  }
  try {
    const ownerId = await getOwnerIdFromResource(req);
    if (!ownerId) {
      return res.status(403).json({ message: "No permitido" });
    }
    if (req.user._id.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "No tienes permiso para esta acción" });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en autorización" });
  }
};

module.exports = { isAdmin, isOwnerOrAdmin };
