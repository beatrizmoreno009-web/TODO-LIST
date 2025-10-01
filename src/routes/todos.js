const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

//GET TODOS
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1});
        res.json(todos); 
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor "});
    }
}); 

//GET TODOS ID 
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id); 
        if (!todo) return res.status(404).json({ error: "TODO NO ENCONTRADO" }); 
        res.json(todo); 
    } catch (err) {
        res.status(400).json({ error: "ID INVALIDO O FORMATO INCORRECTO" }); 
    }
}); 

//POST TODOS 
router.post("/", async (req, res) => {
   const { desc, completed } = req.body;
  if (!desc) return res.status(400).json({ error: "la Descripcion es requerida" });
  try {
    const newTodo = new Todo({ desc, completed });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar el TODO" });
  }
});

//PUT TODOS ID 
router.put("/:id", async (req, res) => {
    const { desc, completed } = req.body;
    try{
        const updated = await Todo.findByIdAndUpdate(
            req.params.id, 
            { desc, completed }, 
            { new: true, runValidators: true }
        ); 
        if (!updated) return res.status(404).json({ error: "Todo con este id no existe" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "ID inválido o datos inválidos" });
    }
});

//DELETE TODOS ID 
router.delete("/:id", async (req, res) => {
    try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Todo con este id no" });
    res.json({ message: "TODO ELIMINADO", todo: deleted });
  } catch (err) {
    res.status(400).json({ error: "ID inválido" });
  }
});

module.exports = router; 
