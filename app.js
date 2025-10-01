const express = require("express");
const bodyParser = require("body-parser");
const todos = require("./src/routes/todos");
require("dotenv").config(); //cargar variables en .env
const connectDB = require("./src/config/db"); 

const app = express();
const PORT = process.env.PORT || 3000; //solamente si no existe el .env que use el 3000 

// Middlewares
app.use(bodyParser.json()); // o bien: app.use(express.json());

// Rutas
app.use("/todos", todos);


app.get("/", (req, res) => {
  res.send("Todo List Home Page");
});

(async () => {
  try{
    await connectDB();
    app.listen(PORT, () => {
      console.log(`App is listening on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("Error al iniciar la app:", err);
    process.exit(1);
  }
})(); 


