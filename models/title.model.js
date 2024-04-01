const mongoose = require('mongoose');

const TitlesSchema = new mongoose.Schema({
    show_id: String,
    type: String,
    title: String,
    director: [String],
    cast: [String],
    country: [String],
    date_added: String,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: [String]
})

const Title = mongoose.model('Title', TitlesSchema);
module.exports = Title;