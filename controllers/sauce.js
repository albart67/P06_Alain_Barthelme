const Sauce = require('../models/Sauce');
const fs = require('fs');


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


exports.likeSauce = (req, res, next) => {
    const sauceLikes = JSON.parse(req.body.like);
    //console.log(sauceLikes);
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const userLikeArray = sauce.usersLiked;
            const lengthLike = userLikeArray.length;
            //console.log(sauce.userId);
            //console.log(lengthLike);

            if (req.body.like == 1) {
                const userId = sauce.userId;
                 Sauce.update({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } })
                    .then(() => res.status(201).json({ message: 'like ajouté!' }))
                    .catch(error => res.status(400).json({ error }));
            }

            else if (req.body.like == -1) {
                const userId = sauce.userId;                
                Sauce.update({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } })
                    .then(() => res.status(201).json({ message: 'dislike ajouté!' }))
                    .catch(error => res.status(400).json({ error }));
            }

            else {
                const userDislikeArray = sauce.usersDisliked;
                const userLikeArray = sauce.usersLiked;
                //console.log(userDislikeArray);
                //console.log(userLikeArray);
                //console.log(userLikeArray.includes(req.body.userId));

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

