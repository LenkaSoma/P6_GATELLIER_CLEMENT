const jsontoken = require('jsonwebtoken'); // On récupère le package Json Web Token

// Middleware pour sécuriser les routes
module.exports = (req, res, next) => {
    try {
        // On récupère le token dans le header de la requête et uniquement le deuxième élement (split)
        const token     = req.headers.authorization.split(' ')[1];
        // On vérifie le token récupéré avec la clé secrète pour qu'elles correspondent
        const decode    = jsontoken.verify(token, 'RANDOM_TOKEN_SECRET');
        // On vérifie que l'userId correspond a celui envoyé dans le token
        const userId    = decode.userId;

        // S'ils ne correspondent pas, envoie une erreur, sinon passe le middleware
        if (req.body.userId && req.body.userId !== userId) {
            // Erreur
            throw 'UserID incorrect';
        } else {
            // OK, ils passent le middleware
            next();
        }
    } catch(error) {
        res.status(401).json({
            // Erreur si problème d'authenficiation
            error: 'La requête a échouée'
        })
    }
};