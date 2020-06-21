const Sauce = require('../models/Sauce');
const fs = require('fs');


//Creation d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //console.log(sauceObject);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        usersLiked: [],
        usersDisliked: [],
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

//Gestion des likes
exports.likeSauce = (req, res, next) => {
    const sauceLikes = JSON.parse(req.body.like);
    
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) {   //l'utilisateur like la sauce
                Sauce.update({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } })
                    .then(() => res.status(201).json({ message: 'like ajouté!' }))
                    .catch(error => res.status(400).json({ error }));
            }

            else if (req.body.like == -1) { //l'utilisateur n'aime pas la sauce                             
                Sauce.update({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } })
                    .then(() => res.status(201).json({ message: 'dislike ajouté!' }))
                    .catch(error => res.status(400).json({ error }));
            }

            else { //l'utilisateur annule le like ou
                const userDislikeArray = sauce.usersDisliked;
                const userLikeArray = sauce.usersLiked;
                
                if (userLikeArray.includes(req.body.userId)) {
                    Sauce.update({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => res.status(201).json({ message: 'like supprimé' }))
                        .catch(error => res.status(400).json({ error }));

                } else if (userDislikeArray.includes(req.body.userId)) {
                    Sauce.update({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(201).json({ message: 'dislike supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(501).json({ error }));
}


//Modification de la sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//Afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
            //console.log(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

//Afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauce) => {
            res.status(200).json(sauce);
            //console.log(sauce);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

