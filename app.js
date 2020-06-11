const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');



mongoose.connect('mongodb+srv://albart67:Modulens-1@cluster0-qtxrj.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

/*

app.use('/api/', (req, res, next) => {
    const tempSauces = [
        {
            _id: 'eizomfhazo',
            name: 'The Last Dab',
            manufacturer: 'Heatonist',
            description: 'CAUTION! The Last Dab—the hottest sauce on Hot Ones, known for turning guests and fans alike into stuttering, fire-breathing lunatics—just got even crazier. The Last Dab first took the world by storm as the only sauce made with Smokin\' Ed Currie\'s infamous "Pepper X." This XX-rated edition gets its one-two punch of heat from addition of the equally lethal "Chocolate Pepper X." All you need is a dab to light the inferno and experience the Hot Ones tradition.',
            heat: 10,
            likes: 100,
            dislikes: 0,
            imageUrl: 'https://cdn.shopify.com/s/files/1/2086/9287/products/LAstdabReduxx_1024x1024-1_1024x1024.jpg?v=1527778720',
            mainPepper: 'Pepper X',
            usersLiked: [],
            usersDisliked: []
        },
        {
            _id: 'oimhoiohmhoih',
            name: 'Los Calientes',
            manufacturer: 'Heatonist',
            description: 'Hot Ones is the show where celebrities divulge their deepest secrets while eating progressively hotter wings. The middle of the lineup is where hot sauce magic happens—the perfect sweet spot between maximum flavor and pleasing heat. Inspired by our favorite Cali-Mex flavors, Los Calientes surfs over the palate with a punchy, smoky blend...',
            heat: 5,
            likes: 100,
            dislikes: 0,
            imageUrl: 'https://cdn.shopify.com/s/files/1/2086/9287/products/LOS_CALIENTES1_1024x1024.jpg?v=1527709467',
            mainPepper: 'Serrano',
            usersLiked: [],
            usersDisliked: []
        },
    ];
    res.status(200);
});

/*


app.use('/api/sauces', (req, res, next) => {
    const sauce = [
        {
            _id: 'oeihfzeoi',
            userId: 'qsomihvqios',
            name: 'Mon premier objet',
            manufacturer: 'Heitz'
            description: 'Les infos de mon premier objet',
            mainPepper: 'pepper'
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            heat: 3,
            likes: 7,
            dislikes: 3,
        },
        {
            _id: 'oeihfzeoi',
            userId: 'qsomihvqios',
            name: 'Mon premier objet',
            manufacturer: 'Heitz'
            description: 'Les infos de mon premier objet',
            mainPepper: 'pepper'
            heat: 6,
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            likes: 7,
            dislikes: 3,
        },
    ];
    res.status(200).json(stuff);
});



userId: { type: String, required: true },
name: { type: String, required: true },
manufacturer: { type: String, required: true },
description: { type: String, required: true },
mainPepper: { type: String, required: true },
imageUrl: { type: String, required: true },
heat: { type: Number, required: true },
likes: { type: Number, required: true },
dislikes: { type: Number, required: true },
*/




app.use(bodyParser.json());


/*
app.post('/api/sauces', (req, res) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
});

*/

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


/*
app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
});
*/






/*
app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
});




app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue alain!' });
});
*/

module.exports = app;

