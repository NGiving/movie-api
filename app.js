const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const Title = require('./models/title.model');

app.enable('trust proxy')
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => { console.log('Connected to MongoDB') });

app.get('/', (req, res) => {
    console.log('Hello');
});

// app.get('/titles', )

app.get('/title/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const title = await Title.find({ show_id: id }).exec();
        res.json(title);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});