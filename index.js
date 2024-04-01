const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const Title = require('./models/title.model');

app.enable('trust proxy')
mongoose.connect(process.env.DB_STRING);

app.get('/titles/:id', async (req, res) => {
    const { id } = req.params;
    const title = await Title.find({ show_id: id }).exec();
    console.log(title);
    res.json(title);
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  })