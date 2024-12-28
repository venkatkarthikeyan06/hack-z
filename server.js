require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 5000;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/personalized_learning')
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(console.error);

// Define MongoDB Schema and Models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const personalizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    courseLevel: { type: String, required: true },
    videoType: { type: String, required: true },
    learningContent: { type: String, required: true },
    language: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Personalization = mongoose.model('Personalization', personalizationSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate-Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes for User Authentication
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// New Route for Storing Personalization Data
app.post('/api/personalization', async (req, res) => {
    const { name, age, courseLevel, videoType, learningContent, language } = req.body;

    if (!name || !age || !courseLevel || !videoType || !learningContent || !language) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newPersonalization = new Personalization({
            name,
            age,
            courseLevel,
            videoType,
            learningContent,
            language,
        });
        await newPersonalization.save();
        res.status(201).json({ message: 'Personalization data saved successfully' });
    } catch (error) {
        console.error('Error saving personalization data:', error);
        res.status(500).json({ error: 'Failed to save personalization data' });
    }

    try {
        const personalizationData = await Personalization.find().sort({ date: -1 }).limit(10); // Get the latest 10 entries
        res.json(personalizationData);
    } catch (error) {
        console.error('Error fetching personalization data:', error);
        res.status(500).json({ error: 'Failed to fetch personalization data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
