const express = require("express");
const router = express.Router();



let todos = [
    {
        id: 1, 
        desc: "Write code",
        completed: false, 
    }, 
    {
        id: 2, 
        desc: "Write another code", 
        completed: true, 
    }
]


//GET TODOS
router.get("/", (req, res) => {
    res.json(todos); 
})

//GET TODOS ID 
router.get("/:id", (req, res) => {
    console.log(req.params.id); 
    let todo = todos. filter((todo) => todo.id == req.params.id); 
    res.json(todo);
}); 

//POST TODOS 
router.post("/", (req, res) => {
    const { desc, completed } = req.body; 

    if(!desc){
        return res.status(400).json({ error: "la Descripcion es requerida" });

        }

        const newTodo = {
            id: todos.length > 0 ? todos [todos.length -1].id + 1 : 1,
            desc, 
            completed: completed || false,
        }; 

        todos.push(newTodo); 
        res.status(201).json(newTodo);
});

//PUT TODOS ID 
router.put("/:id", (req, res) => {
    let todo = todos.find((todo) => todo.id == req.params.id);
    if (todo) {
        todo.desc = req.body.desc;
        todo.completed = req.body.completed;
        res.json(todos);
    } else {
        req.send("Todo con este id no existe");
    } 
});

//DELETE TODOS ID 
router.delete("/:id", (req, res) => {
    let index = todos.findIndex(todo => todo.id == req.params.id);
    todos.splice(index, 1)
    console.log(index); 
    res.json(todos); 
});

module.exports = router; 