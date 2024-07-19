const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        CreatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        likes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }],
        comments: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: String,
            date: { type: Date, default: Date.now }
        }]
    });
    

module.exports = mongoose.model("Post", postSchema)
