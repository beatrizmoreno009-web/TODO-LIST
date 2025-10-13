const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
  // Datos básicos del paciente
  nombre: { type: String, required: true },
  primerApellido: { type: String, required: true },
  segundoApellido: { type: String },

  // Características médicas
  sexo: String,
  edad: Number,
  peso: Number,
  estatura: Number,
  bmi: Number,
  circunferencia_abdominal: Number,
  presion_sanguinea: Number,
  colesterol: Number,
  albumina: Number,
  azucar_en_sangre: Number,
  consumo_tabaco: Boolean,
  riesgo_cardiovascular: Number,
  ritmo_cardiaco: Number,
  consumo_alcohol: Boolean,
  actividad_fisica: String,
  enfermedades: {
    cardiovascular_disease: Boolean,
    fatty_liver_disease: Boolean,
    cirrhosis_disease: Boolean,
    diabetes: Boolean,
    copd: Boolean,
    kidney_disease: Boolean,
    hypertension: Boolean
  },

imagenFondoOjo: {
    data: { type: Buffer, default: null },
    contentType: { type: String, default: null }
  },
  senalPPG: {
    data: { type: Buffer, default: null },
    contentType: { type: String, default: null }
  },
  pdfReport: {
    data: { type: Buffer, default: null },
    contentType: { type: String, default: null }
  },

  // Asociación con médico (usuario)
  medico: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

module.exports = mongoose.model("Paciente", pacienteSchema);
