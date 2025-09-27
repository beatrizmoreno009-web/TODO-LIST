const express = require("express");
const bodyParser = require("body-parser");
const todos = require("./routes/todos");

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json()); // o bien: app.use(express.json());

// Rutas
app.use("/todos", todos);


app.get("/", (req, res) => {
  res.send("Todo List Home Page");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`App is listening on PORT: ${PORT}`);
});
