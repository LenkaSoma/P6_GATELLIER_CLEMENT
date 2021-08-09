const Sauce = require('../models/Sauce');
const fs    = require('fs');

// AJOUTER UNE NOUVELLE SAUCE
exports.createSauce = (req, res, next) => {
    // On stocke les données reçues par le front dans une variable en JSON
    const sauceObject = JSON.parse(req.body.sauce);

    // On supprime l'ID généré - Elle est générée par la base mongodb
    delete sauceObject._id;

    // On crée une instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    // On sauvegarde la sauce avec un statut 201 ou un statut 400 en cas d'erreur
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce sauvegardée avec succès !' }))
    .catch(error => res.status(400).json({ error }));
};

// MODIFIER UNE SAUCE
exports.editSauce = (req, res, next) => {
    let sauceObject = {};

    req.file ? (
        Sauce.findOne({
            _id: req.params.id
        }).then((sauce) => {
            // Pour extraire le lien de l'image, on récupère l'URL de la sauce en ajoutant le chemin vers l'image
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlinkSync(`images/${filename}`)
        }),
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    ) : (
        sauceObject = { ...req.body }
    )

    Sauce.updateOne(
        // On met a jour les informations
        { _id: req.params.id }, 
        { ...sauceObject, _id: req.params.id }
    ).then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !' })).catch(error => res.status(400).json({ error }));
};

// SUPPRIMER UNE SAUCE
exports.removeSauce = (req, res, next) => {
    // On va récupérer l'URL de l'image et supprimer le fichier image
    Sauce.findOne({ _id: req.params.id }).then(sauce => {
        // Pour extraire le lien de l'image, on récupère l'URL de la sauce en ajoutant le chemin vers l'image
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            // On supprime de la base de données
            Sauce.deleteOne({ _id: req.params.id }).then(() => res.status(200).json({ 
                message: 'Sauce supprimée avec succès !'
            })).catch(error => res.status(400).json({
                error
            }));
        });
    }).catch(error => res.status(500).json({ error }));
};

// RECUPERER UNE SAUCE
exports.getSauce = (req, res, next) => {
    // On récupère la sauce avec son ID
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// RECUPERER TOUTES LES SAUCES
exports.getAllSauces = (req, res, next) => {
    // On recherche toutes les sauces existantes
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// LIKES / DISLIKES
exports.like = (req, res, next) => {
    let like = req.body.like
    // On récupère l'userID
    let userId = req.body.userId
    // On récupère l'ID de la sauce
    let sauceId = req.params.id
  
    if (like === 1) { // Si il s'agit d'un like
      Sauce.updateOne({
          _id: sauceId
        }, {
          $push: { usersLiked: userId },
          $inc: { likes: +1 }, // On ajoute +1 aux likes
        })
        .then(() => res.status(200).json({ message: 'Vous avez aimé cette sauce !' }))
        .catch((error) => res.status(400).json({ error }))
    }
    if (like === -1) { // S'il s'agit d'un dislike
      Sauce.updateOne(
          {
            _id: sauceId
          }, {
            $push: { usersDisliked: userId },
            $inc: { dislikes: +1 }, // On ajoute +1 aux dislikes
          }
        )
        .then(() => { res.status(200).json({ message: 'Vous n\'aimez pas cette sauce !' })})
        .catch((error) => res.status(400).json({ error }))
    }
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
      Sauce.findOne({
          _id: sauceId
        })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: { usersLiked: userId },
                $inc: { likes: -1 }, // On enlève -1 aux likes
              })
              .then(() => res.status(200).json({ message: 'Like retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
          if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: { usersDisliked: userId },
                $inc: {  dislikes: -1 }, // On enlève -1 aux dislikes
              })
              .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
        }).catch((error) => res.status(404).json({ error }))
    }
};