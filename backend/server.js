// server.js (Backend)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Url = require('./models/Url');
const shortid = require('shortid');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.post('/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).send('Original URL is required');
        }
        const shortCode = shortid.generate();
        const url = new Url({ originalUrl, shortCode });
        await url.save();
        res.json({ shortUrl: `http://localhost:3000/${shortCode}` });
    } catch (error) {
        console.error('Error saving URL:', error);
        res.status(500).send(error.message);
    }
});

app.get('/urls', async (req, res) => {
    try {
        const urls = await Url.find({}).sort({ _id:-1});
        res.json(urls.map(url => ({
            originalUrl: url.originalUrl,
            shortUrl: `http://localhost:3000/${url.shortCode}`
        })));
    } catch (error) {
        console.error('Error fetching URLs:', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.code });
        if (url) {
            res.redirect(url.originalUrl);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Error finding URL:', error.message);
        res.status(500).send(error.message);
    }
});

const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
