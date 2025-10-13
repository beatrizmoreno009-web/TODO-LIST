const express = require("express");
const multer = require("multer");
const Paciente = require("../../models/pacienteModel");

const router = express.Router();

// Configuración: multer en memoria (archivos no se guardan en disco)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Campos permitidos para los archivos multimedia
const camposPermitidos = ["imagenFondoOjo", "senalPPG", "pdfReport"];

// GET: Obtener info general (sin datos binarios)
router.get("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id).select("-imagenFondoOjo.data -senalPPG.data -pdfReport.data");
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Descargar archivo multimedia (imagenFondoOjo, senalPPG, pdfReport)
router.get("/:id/:campo", async (req, res) => {
  try {
    const { id, campo } = req.params;
    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ message: "Campo inválido" });
    }
    const paciente = await Paciente.findById(id);
    if (!paciente || !paciente[campo] || !paciente[campo].data) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    res.contentType(paciente[campo].contentType);
    res.send(paciente[campo].data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Subir un nuevo archivo (imagen, PPG o PDF)
router.post("/:id", upload.single("file"), async (req, res) => {
  try {
    const { campo } = req.body;
    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ message: "Campo inválido" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    paciente[campo] = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    await paciente.save();
    res.status(201).json({ message: `Archivo ${campo} guardado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Actualizar un archivo existente
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { campo } = req.body;
    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ message: "Campo inválido" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    paciente[campo] = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    await paciente.save();
    res.json({ message: `Archivo ${campo} actualizado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Eliminar archivo de un campo específico
router.delete("/:id", async (req, res) => {
  try {
    const { campo } = req.body;
    if (!camposPermitidos.includes(campo)) {
      return res.status(400).json({ message: "Campo inválido para eliminación" });
    }

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ message: "Paciente no encontrado" });

    if (!paciente[campo] || !paciente[campo].data) {
      return res.status(400).json({ message: "No hay archivo que eliminar en este campo" });
    }

    paciente[campo] = undefined;
    await paciente.save();

    res.json({ message: `Archivo ${campo} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
