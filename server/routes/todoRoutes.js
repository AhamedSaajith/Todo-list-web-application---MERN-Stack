const express = require("express");
const router = express.Router();
const Todo = require("../model/model.js");

// POST route to create a new todo item
router.post("/create-todo", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new Todo({
      title,
      description,
    });

    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: error.message });
  }
});

//view todo items
router.get("/view-todo", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: error.message });
  }
});

//update todo item
router.put("/update-todo/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error("Error updating data", err);
    res.status(500).json({ message: err.message });
  }
});

//Delete todo item
router.delete("/delete-todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }
    res.status(200).json({ message: "Todo deleted succsfulyy!!", deletedTodo });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
