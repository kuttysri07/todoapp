const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { Pool } = require('pg');
const path = require("path");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json()); // req.body

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Client/build/index.html"));
    });
}

// Connect to the database
const devConfig = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
};

const proConfig = {
    connectionString: process.env.DATABASE_URL
};

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

// Add new todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get one todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const oneTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(oneTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Edit one todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo was updated");
    } catch (err) {
        console.error(err.message);
    }
});

// Delete one todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted");
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
