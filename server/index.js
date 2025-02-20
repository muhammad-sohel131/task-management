const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Create an HTTP server for Express and WebSockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${userName}:${password}@cluster0.jd7el.mongodb.net/taskDB?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    startChangeStream();
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    timestamp: { type: Date, default: Date.now },
    category: { type: String, enum: ['To-Do', 'In Progress', 'Done'], required: true }
});

// Task Model
const Task = mongoose.model('Task', taskSchema);

// Start Change Stream after DB connection
function startChangeStream() {
    const taskCollection = mongoose.connection.collection("tasks");
    const changeStream = taskCollection.watch();

    changeStream.on("change", (change) => {
        console.log("Change detected:", change);
        io.emit("task-updated", change);
    });
}

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Routes
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Welcome to JobTask API End" });
});

// Start the Server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
