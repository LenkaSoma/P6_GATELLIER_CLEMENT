const mongoose = require('mongoose');

const SchemaSauce = mongoose.Schema({
    userId:         { type: String, required: true },
    name:           { type: String, required: true, maxlength: [15, 'Maximum 15 caractères'] },
    manufacturer:   { type: String, required: true, maxlength: [30, 'Maximum 30 caractères'] },
    description:    { type: String, required: true },
    mainPepper:     { type: String, required: true, maxlength: [15, 'Maximum 15 caractères'] },
    imageUrl:       { type: String, required: true },
    heat:           { type: Number, required: true },
    likes:          { type: Number, required: false, default: 0 },
    dislikes:       { type: Number, required: false, default: 0 },
    usersLiked:     { type: Array, required: false },
    usersDisliked:  { type: Array, required: false }
});

module.exports = mongoose.model('Sauce', SchemaSauce);