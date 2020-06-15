const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

/*

exports.likeSauce = (req, res, next) => {
    const sauceLikes = JSON.parse(req.body.like);
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) {
                Sauce.Update({ _id: req.params.id }, { $push: [{ usersLiked: req.params.id }] })
                    .then(() => res.status(201).json({ message: 'like ajouté!' }))
                    .catch(error => res.status(400).json({ error }));

            };

        });


};

*/





exports.likeSauce = (req, res, next) => {
    const sauceLikes = JSON.parse(req.body.like);

    console.log(sauceLikes)

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            const userLikeArray = sauce.usersLiked;
            const lengthLike = userLikeArray.length;
            console.log(sauce.userId);
            console.log(lengthLike);

            if (req.body.like === 1) {
                const userId = sauce.userId;
                //const userDislikeArray = sauce.usersLiked;
                Sauce.update({ _id: req.params.id }, { $push: [{ usersLiked: req.params.id }] })
                Sauce.update({ _id: req.params.id }, { $inc: { likes: 1 } })


                    .then(() => res.status(201).json({ message: 'like ajouté!' }))
                    .catch(error => res.status(400).json({ error }));
            }

            else if (req.body.like === -1) {
                const userId = sauce.userId;
                //const userDislikeArray = sauce.usersLiked;
                Sauce.update({ _id: req.params.id }, { $push: [{ usersDisliked: req.params.id }] })
                    //Sauce.findOneAndUpdate({ _id: req.params.id }, { $set: { disLike: userDislikeArray.length } })
                    //Sauce.dislikes = Sauce.usersDisliked.length
                    //sauce.save()
                    .then(() => res.status(201).json({ message: 'dislike ajouté!' }))
                    .catch(error => res.status(400).json({ error }));
            }

            else {
                //Sauce.update({ _id: req.params.id }, { $pull: { usersLiked: [req.body.userId] } })
                Sauce.update({ _id: req.params.id }, { $pull: { usersDisliked: [req.body.userId], usersLiked: [req.body.userId] } })

                    .then(() => res.status(201).json({ message: 'like ou dislike supprimé' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(501).json({ error }));
}





//$set: [{ "likes.1": { _id: req.params.userId } }] }


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
            console.log(sauce);
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
            console.log(sauce);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

