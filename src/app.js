const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos subidos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas de autenticación
app.use("/api/auth", require("./routes/auth")); 


// Rutas protegidas
app.use("/api/users", require("./routes/users"));
app.use("/api/datasets", require("./routes/datasets"));
app.use("/api/paciente", require("./routes/paciente"));
app.use("/api/paciente/upload", require("./routes/features/upload"));
app.use("/api/admin/pacientes", require("./routes/adminPacientes"));
app.use("/api/medico/pacientes", require("./routes/medicoPacientes"));

// Rutas para administración de médicos (solo para Admin)
app.use("/api/admin/medicos", require("./routes/adminMedicos"));

// Ruta raíz
app.get("/", (req, res) => {
  res.send("DataMedAI API funcionando correctamente");
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
