// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

const BACKEND_URL = 'http://localhost:2000'; 

// Route to shorten a URL
app.post('/shorten', async (req, res) => {
    try {
        console.log('Received request to shorten URL:', req.body);
        const response = await axios.post(`${BACKEND_URL}/shorten`, req.body);
        console.log('Backend response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /shorten route:', error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

// Route to handle URL redirection
app.get('/:code', async (req, res) => {
    try {
        console.log('Received request to redirect code:', req.params.code);
        const response = await axios.get(`${BACKEND_URL}/${req.params.code}`);
        console.log('Redirecting to:', response.request.res.responseUrl);
        res.redirect(response.request.res.responseUrl);
    } catch (error) {
        console.error('Error in /:code route:', error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

// New route to fetch all URLs
app.get('/urls', async (req, res) => {
    try {
        console.log('Received request to fetch all URLs');
        const response = await axios.get(`${BACKEND_URL}/urls`);
        console.log('Backend response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error in /urls route:', error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
