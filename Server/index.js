const express=require("express");
const app=express();
const port=process.env.PORT || 5000;
const cors=require("cors");
const { Pool } = require('pg');
const path=require("path");
require("dotenv").config();




//middleware
app.use(cors());
app.use(express.json()); //req.body

app.use(express.static(path.join(__dirname,"..Client/build")))

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"..Client/build")))
}


//connect database
const devConfig ={
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
}

const proConfig={
    connectionString: process.env.DATABASE_URL
}

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

//add new todo

app.post("/todos",async(req,res)=>{
    try {
     const{description}= req.body;
     const newtodo=await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *",[description]);
     res.json(newtodo)
    } catch (err) {
        console.log(err.message);
    }
})

//get all todo

app.get("/todos",async(req,res)=>{
    try {
    
     const alltodo=await pool.query("SELECT * FROM todo");
     res.json(alltodo.rows)
    } catch (err) {
        console.log(err.message);
    }
})

//get one todo

app.get("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const getonetodo=await pool.query("SELECT * FROM todo WHERE todo_id=$1",[id]);
        res.json(getonetodo.rows);
    } catch (err) {
        console.log(err.message);
    }
})

//edit one todo

app.put("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const {description}=req.body;
        const edittodo=await pool.query("UPDATE todo SET description = $1 WHERE todo_id=$2",[description,id]);
        res.json("todo was updated");


    } catch (err) {
        console.log(err.message);
    }
})

app.delete("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const deletetodo=await pool.query("DELETE FROM todo WHERE todo_id=$1",[id]);
        res.json("todo was DELETED")


    } catch (err) {
        console.log(err.message);
    }
})

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"Client/build/index.html"))
})

app.listen(port,()=>{
    console.log(`server ${port} has been started`)
})
