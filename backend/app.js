const express       = require('express');       // Import d'Express
const bodyParser    = require('body-parser');   // Import de bodyParser pour gérer les JSONS d'une requête POST
const mongoose      = require('mongoose');      // Import de Mongoose pour se connecter a la DB Mongo
const path          = require('path');          // Import de path pour upload des images et gérer les fichiers
const helmet        = require('helmet');        // Import d'Helmet pour améliorer la sécurité de l'application
const app           = express();

// Importation des chemins d'accès
const saucesRoutes = require('./routes/sauce');
const userRoutes   = require('./routes/user');

// Utilisation de dotenv pour masquer les informations sensibles et les basculer sur le fichier .env
require('dotenv').config();

// Connexion a MongoDB par le biais du fichier .env
mongoose.connect(process.env.DATABASE_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion MongoDB établie avec succès !'))
.catch(() => console.log('Connexion MongoDB impossible !'));

// Gestion CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Transforme les données POST en objet JSON
app.use(helmet()); // Mise en place du X-XSS-Protection / Sécurité
app.use('/images', express.static(path.join(__dirname, 'images'))); // Permet de charger les fichiers dans le dossier images

// API
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;