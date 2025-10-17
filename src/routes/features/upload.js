const express = require("express");
const multer = require("multer");
const Paciente = require("../../models/pacienteModel");

const router = express.Router();

// Configuración: almacenamiento en memoria (sin archivos en disco)
const storage = multer.memoryStorage();
const upload = multer({ storage });

//  Campos permitidos donde se guardarán los archivos
const camposPermitidos = ["imagenFondoOjo", "senalPPG", "pdfReport"];

/* ===============================
    POST - Subir un nuevo archivo
   =============================== */
router.post("/:id", upload.single("file"), async (req, res) => {
  try {
    const { campo } = req.body;
    if (!camposPermitidos.includes(campo))
      return res.status(400).json({ message: "Campo inválido" });
    if (!req.file)
      return res.status(400).json({ message: "No se subió ningún archivo" });

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente)
      return res.status(404).json({ message: "Paciente no encontrado" });

    // Guardar el archivo en MongoDB como Buffer
    paciente[campo] = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await paciente.save();
    res.status(201).json({ message: `Archivo ${campo} subido correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET - Descargar archivo multimedia
   =============================== */
router.get("/:id/:campo", async (req, res) => {
  try {
    const { id, campo } = req.params;
    if (!camposPermitidos.includes(campo))
      return res.status(400).json({ message: "Campo inválido" });

    const paciente = await Paciente.findById(id);
    if (!paciente || !paciente[campo] || !paciente[campo].data)
      return res.status(404).json({ message: "Archivo no encontrado" });

    // Enviar archivo binario
    res.contentType(paciente[campo].contentType);
    res.send(paciente[campo].data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   PUT - Actualizar archivo existente
   =============================== */
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { campo } = req.body;
    if (!camposPermitidos.includes(campo))
      return res.status(400).json({ message: "Campo inválido" });
    if (!req.file)
      return res.status(400).json({ message: "No se subió ningún archivo" });

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente)
      return res.status(404).json({ message: "Paciente no encontrado" });

    // Reemplazar archivo anterior
    paciente[campo] = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await paciente.save();
    res.json({ message: `Archivo ${campo} actualizado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   DELETE - Eliminar archivo multimedia
   =============================== */
router.delete("/:id", async (req, res) => {
  try {
    const { campo } = req.body;
    if (!camposPermitidos.includes(campo))
      return res.status(400).json({ message: "Campo inválido para eliminación" });

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente)
      return res.status(404).json({ message: "Paciente no encontrado" });

    if (!paciente[campo] || !paciente[campo].data)
      return res.status(400).json({ message: "No hay archivo que eliminar" });

    // Eliminar archivo del documento MongoDB
    paciente[campo] = { data: null, contentType: null };
    await paciente.save();

    res.json({ message: `Archivo ${campo} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
