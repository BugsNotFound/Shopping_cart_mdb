const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = 'mongodb://himansh:himansh1@ds163757.mlab.com:63757/shopping_cart_mvc';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

// Template Engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
//secret is used for signing the hash which secretely stores our id in the cookie... 

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    try {
        const isLoggedIn = req.session.isLoggedIn;
        res.locals.isAuthenticated = isLoggedIn;
    } catch (err) {
        res.locals.isAuthenticated = false;
        //console.log(err);
    }
    next();
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Catch all Middleware
app.use(errorController.get404);


mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: "Himansh",
                        email: "himansh.jain1997@gmail.com",
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
        app.listen(process.env.PORT || 3000, function() {
            console.log("I am listening...");
        })
    })
    .catch(err => console.log(err));