const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Feature = require("../../models/featureModel"); 

const router = express.Router();

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

// Filtro de tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|csv|txt/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo imágenes, PDFs, CSV o TXT."));
  }
};

const upload = multer({ storage, fileFilter });

// Utilidad para borrar archivo físico
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../../uploads/", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// GET: Obtener archivos multimedia asociados a un paciente
router.get("/:id", async (req, res) => {
  try {
    const paciente = await Feature.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({
      imagenFondoOjo: paciente.imagenFondoOjo || null,
      senalPPG: paciente.senalPPG || null,
      pdfReport: paciente.pdfReport || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Subir nuevo archivo (imagen, PDF, señal) para un campo específico
router.post("/:id", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se subió ningún archivo" });

    const paciente = await Feature.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    const { campo } = req.body;
    const camposPermitidos = ["imagenFondoOjo", "senalPPG", "pdfReport"];

    if (!camposPermitidos.includes(campo)) {
      deleteFile(req.file.filename);
      return res.status(400).json({ message: "Campo inválido para archivo" });
    }

    // Borrar archivo anterior si existía
    if (paciente[campo]) deleteFile(paciente[campo]);

    // Guardar nuevo archivo
    paciente[campo] = req.file.filename;
    await paciente.save();

    res.status(201).json({
      message: `Archivo ${campo} subido correctamente`,
      file: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Actualizar archivo existente
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se subió ningún archivo" });

    const paciente = await Feature.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    const { campo } = req.body;
    const camposPermitidos = ["imagenFondoOjo", "senalPPG", "pdfReport"];

    if (!camposPermitidos.includes(campo)) {
      deleteFile(req.file.filename);
      return res.status(400).json({ message: "Campo inválido para archivo" });
    }

    // Borrar archivo anterior si existía
    if (paciente[campo]) deleteFile(paciente[campo]);

    paciente[campo] = req.file.filename;
    await paciente.save();

    res.json({
      message: `Archivo ${campo} actualizado correctamente`,
      file: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Eliminar archivo de un campo
router.delete("/:id", async (req, res) => {
  try {
    const paciente = await Feature.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    const { campo } = req.body;
    const camposPermitidos = ["imagenFondoOjo", "senalPPG", "pdfReport"];

    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ message: "Campo inválido para eliminación" });
    }

    if (!paciente[campo]) {
      return res.status(400).json({ message: "No hay archivo para eliminar en ese campo" });
    }

    // Eliminar físicamente
    deleteFile(paciente[campo]);
    paciente[campo] = "";
    await paciente.save();

    res.json({ message: `Archivo ${campo} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
