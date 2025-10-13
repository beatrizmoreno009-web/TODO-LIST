const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config(); // cargamos las variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conexión a la base de datos
connectDB();

// Rutas principales
app.use("/api/users", require("./routes/users"));
app.use("/api/datasets", require("./routes/datasets"));
app.use("/api/paciente", require("./routes/paciente")); // Pacientes
app.use("/api/paciente/upload", require("./routes/features/upload")); // Archivos multimedia (PDF, imagen, señal)

// Ruta raíz
app.get("/", (req, res) => res.send("DataMedAI API funcionando correctamente"));

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));