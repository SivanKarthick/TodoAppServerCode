// Using Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// create an instance of express
const app = express();

app.use(express.json()); // using the middleware use () 
app.use(cors());

// Define a route
// app.get("/", (req, res) => {
//     res.send("Hello World")
// });

// const todos = [];

// Connecting Mongo DB
mongoose.connect("mongodb://localhost:27017/todos-app")
.then(()=> {
    console.log("DB Connected...");
})
.catch((error)=> {
    console.log(error, "ERROR");
});


// Creating Schemas
const toDosSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String
});

// Creating Model

const toDoModel = mongoose.model("Todo", toDosSchema);

// Create a new todo List
app.post("/addTodos", async (req, res)=> {
    const { title, description } = req.body;
    try {
        const newTodo = new toDoModel({title, description});
        await newTodo.save();
        res.status(201);
        res.json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error?.message
        });
    }
});

// Get All the datas
app.post("/getAllTodos", async (req,res)=> {
    try {
        const todos = await toDoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);    
        res.status(500).json({
            message: error?.message
        });
    }
});

// Update a todo Item
app.post("/updateTodoItem", async (req,res)=> {
    try {
        const { title, description, id } = req.body;
        const updatedTodo = await toDoModel.findByIdAndUpdate(
            id,
            {title, description},
            { new: true }
        );
        if(updatedTodo) {
            res.json(updatedTodo);
        } else {
            return res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })        
    }
});

// Delete Todo Item 

app.post("/deleteTodoItem", async (req,res)=> {
    try {
        const { id } = req.body;
        const deleteTodo = await toDoModel.findByIdAndDelete(
            id,
            { new: true }
        );
        if(deleteTodo) {
            res.status(204).json(deleteTodo).end();
        } else {
            return res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })        
    }
});



// Start the server
const port = "8000";
app.listen(port, () => {
    console.log("Server is Listneing to port ", port);
});