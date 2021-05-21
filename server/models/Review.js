const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    title: {
        type:String,
    },
    template: {
        type:String,
    },
    content: {
        type:String,
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review }