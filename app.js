
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using https
}));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock database
let users = [
    {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        services: 'Escorting, Companionship',
        apiKey: 'A6DUlVniQ840NkXj1kLY-Srs2WjB4yJXOwFxR5zcidMgNXPDIvplxXuWwRc7AvrY',
        phoneNumber: '+12503009923'
    }
];

// Helper function to find user by email
const findUserByEmail = (email) => users.find(user => user.email === email);

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// API helper function
async function fetchApiData(apiKey, phoneNumber) {
    const endpoints = {
        "receive": "https://api.httpsms.com/v1/messages/receive",
        "send": "https://api.httpsms.com/v1/messages/send",
        "threads": "https://api.httpsms.com/v1/message-threads"
    };

    try {
        const response = await axios.get(endpoints.threads, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            params: {
                owner: phoneNumber
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching API data:', error);
        return null;
    }
}

// EJS Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (user && user.password === password) {
        req.session.user = user;
        res.redirect('/profile');
    } else {
        res.send('Invalid email or password');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { name, email, password, services, apiKey, phoneNumber } = req.body;
    if (findUserByEmail(email)) {
        res.send('Email already exists');
    } else {
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            services,
            apiKey,
            phoneNumber
        };
        users.push(newUser);
        res.redirect('/login');
    }
});

app.get('/subscription', isLoggedIn, (req, res) => {
    res.render('subscription', { user: req.session.user });
});

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { user: req.session.user });
});

app.post('/profile', isLoggedIn, (req, res) => {
    const { name, email, services, apiKey, phoneNumber } = req.body;
    const user = req.session.user;
    user.name = name;
    user.email = email;
    user.services = services;
    user.apiKey = apiKey;
    user.phoneNumber = phoneNumber;
    // Update the user in the mock database
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
    }
    res.redirect('/profile');
});

app.get('/profiles', isLoggedIn, (req, res) => {
    res.render('profiles', { user: req.session.user, profiles: users });
});

app.get('/api-data', isLoggedIn, async (req, res) => {
    const user = req.session.user;
    const apiData = await fetchApiData(user.apiKey, user.phoneNumber);
    res.render('api-data', { user: user, apiData: apiData });
});

// Webhook listener
app.post('/webhook', (req, res) => {
    const webhookData = req.body;
    console.log('Received webhook:', webhookData);
    // Process the webhook data here
    res.status(200).send('Webhook received');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
