# Este es un proyecto de backend para la gestión de usuarios y datos médicos multimodales.

- pacienteModel.js: 
Define las caracteristicas de datos basicos (nombre, primer apellido, segundo apellido) y datos medicos (edad, peso, enfermedades, etc.).
Define campos para almacenar archivos multimedia (imagenFondoOjo, senalPPG, pdfReport) usando Buffer para almacenar datos binarios directamente en MongoDB.
Relaciona el paciente a un medico. 

- paciente.js: 
Expone las rutas para CRUD de pacientes y sus características.
POST /api/paciente/: crea un nuevo paciente.
GET /api/paciente/: obtiene todos los pacientes.
PUT /api/paciente/:id: actualiza un paciente por ID.
DELETE /api/paciente/:id: elimina un paciente por ID.

- userModel.js: 
Define un esquema para administradores con campos nombre, email, contraseña, rol y nos genera un id.
El campo rol puede ser "Administrador" o "Usuario"

- users.js: 
Para manejar la gestión de administradores.
POST /api/users/: crear administrador.
GET /api/users/: obtener todos los administradores.
PUT /api/users/:id: actualizar administrador por ID.
DELETE /api/users/:id: eliminar administrador por ID.

- upload.js: 
Controlar la subida, actualización, descarga y eliminación de archivos multimedia (imágenes, señales PPG, PDFs) para cada paciente.
Usa multer para recibir archivos en memoria y guardarlos directamente en MongoDB.
POST /api/features/upload/:id: subir nuevo archivo multimedia (campo debe ser uno de: "imagenFondoOjo", "senalPPG", "pdfReport").
PUT /api/paciente/upload/:id: actualizar archivo multimedia.
GET /api/paciente/upload/:id: obtener info básica del paciente sin los archivos binarios.
GET /api/paciente/upload/:id/:campo: descargar archivo multimedia (imagen, PPG o PDF).
DELETE /api/paciente/upload/:id: eliminar archivo multimedia de un campo específico.

- Cómo MongoDB trata los archivos multimedia en Buffer
Mongo almacena datos binarios como tipo BSON BinData, que en Mongoose se representa como un objeto Buffer.
Cuando haces .save() con un Buffer, Mongo almacena el contenido binario. 
Para enviar estos datos al cliente, debes enviarlos con el tipo MIME correcto (res.contentType()).

