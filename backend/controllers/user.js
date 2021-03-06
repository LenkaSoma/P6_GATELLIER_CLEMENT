const cryptage  = require('bcrypt');
const User      = require('../models/user');
const jsontoken = require('jsonwebtoken');

// Module pour l'inscription
exports.register = (req, res, next) => {
    cryptage.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save()
            .then(() => res.status(201).json({ message: 'Inscription effectuée !' }))
            .catch(error => res.status(400).json({ error }));
    }).catch(error => res.status(500).json({ error }));
};

// Module pour la connexion
exports.login = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur introuvable !' });
        }

        // On compare les deux mots de passe vérifier si identique
        cryptage.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error : 'Mot de passe incorrect !' });
            }

            res.status(200).json({
                userId : user._id,
                token: jsontoken.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h'})
            });
        }).catch(error => res.status(500).json({ error }));
    }).catch(error => res.status(500).json({ error }));
};