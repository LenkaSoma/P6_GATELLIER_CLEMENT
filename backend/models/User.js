const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const SchemaUser = mongoose.Schema({
    email: { 
        type: String, 
        unique: true, 
        required: [true, "Veuillez indiquer une adresse mail"], 
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez indiquer une adresse email valide"] 
    },
    password : {
        type: String,
        required: [true, "Veuillez indiquer un mot de passe"]
    }
});

SchemaUser.plugin(uniqueValidator);
SchemaUser.plugin(sanitizerPlugin);

module.exports = mongoose.model('User', SchemaUser);

