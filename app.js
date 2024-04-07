const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Title = require('./models/title.model');

app.use(cors());
app.enable('trust proxy')
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));

app.get('/api/titles/:page', async (req, res) => {
    const { page } = req.params
    const count = await Title.countDocuments({}).exec();
    if (page <= 0 || page > Math.ceil(count / 50)) {
        res.status(400).send('Bad Link');
        return;
    }
    try {
        const titles = await Title.find({}).skip(50 * (page - 1)).limit(50).lean();
        const ret = titles.map(({ show_id, title, release_year }) => ({
            show_id: show_id,
            title: title,
            release_year: release_year
        }));
        res.json(ret);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get('/api/title/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const title = await Title.findOne({ show_id: id }).lean();
        if (id.substring(0, 2).toUpperCase() === 'TT') {
            console.log('fetching')
            fetch(`https://www.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`)
                .then(res => res.json())
                .then(({ Poster, Ratings, imbdbVotes }) => res.json({ ...title, poster: Poster, ratings: Ratings, imddbVotes: imbdbVotes }))
            return
        }
        res.json(title);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get('/api/find/:title', async (req, res) => {
    const title = req.params.title.trim();
    try {
        const movie = await Title.find({ "title": { $regex: new RegExp(title, "i") } }).sort({ "title": 1 }).limit(10);
        res.json(movie)
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});