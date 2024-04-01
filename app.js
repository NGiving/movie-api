const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const Title = require('./models/title.model');

app.enable('trust proxy')
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => { console.log('Connected to MongoDB') });

app.get('/', (req, res) => res.send('Hello'));

// app.get('/titles', )

app.get('/title/:id', async (req, res) => {
    const { id } = req.params;
    const title = await Title.find({ show_id: id }).exec();
    res.json(title);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});