// Main Node.js + Express server setup
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// MongoDB Connection
const mongoURI = "mongodb://127.0.0.1:27017/personalized_learning"; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Connection error:', err);
    });

// Define MongoDB Schema and Models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema); // Fixed extra space in model name

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(403);
    }
};

// JWT Secret
const JWT_SECRET = 'your_jwt_secret'; // Change this to a secure secret

// Register a new user
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

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

// Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token with user ID and name
        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, name: user.name }); // Include user's name in the response
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

// API endpoint to get user data
app.get('/api/user', authenticateJWT, async (req, res) => { 
    try {
        const user = await User.findById(req.user.id).select('name'); // Fetch user name
        if (user) {
            res.json({ name: user.name });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Serve the introduction page
app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Serve the login/register page
app.get('/auth.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/auth.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
