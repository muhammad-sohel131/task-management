const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const userName = process.env.db_username
const password = process.env.db_password

const uri = `mongodb+srv://${userName}:${password}@cluster0.jd7el.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri);

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    timestamp: { type: Date, default: Date.now },
    category: { type: String, enum: ['To-Do', 'In Progress', 'Done'], required: true }
});

// model
const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
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

app.get('/', (req, res) => {
    res.json({message: "Welcome to JobTask API End"})
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
