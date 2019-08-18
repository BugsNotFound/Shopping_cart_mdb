const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

// Template Engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("5d58e9c8b7d1790a38e8eb41")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Catch all Middleware
app.use(errorController.get404);


mongoose.connect("mongodb://himansh:himansh1@ds163757.mlab.com:63757/shopping_cart_mvc", { useNewUrlParser: true })
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