const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const Title = require('./models/title.model');

app.enable('trust proxy')
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.connection.once('open', () => { console.log('Connected to MongoDB') });

app.get('/api/titles', async (req, res) => {
    try {
        const titles = await Title.find({}).exec();
        const ret = titles.map(({ show_id, title, release_year }) => ({
            show_id: show_id,
            title: title,
            release_year: release_year
        }));
        res.json(ret);
    } catch (error) {
        console.error(err);
        res.status(500).send("Server Error");
    }
})

app.get('/api/title/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const title = await Title.findOne({ show_id: id }).exec().lean();
        if (id.substring(0, 2).toUpperCase() === 'TT')
            fetch(`https://www.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`)
                .then(res => res.json())
                .then(({ Poster, Ratings, imdbVotes }) => title = { ...title, poster: Poster, ratings: Ratings, imdbVotes: imdbVotes })
        res.json(title);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});