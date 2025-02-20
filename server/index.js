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

const Task = mongoose.model('Task', taskSchema);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
