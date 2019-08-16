const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
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
    User.findById("5d5683e0e7179a084eef8178")
        .then(user => {
            req.user = user;
            next()
        })
        .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Catch all Middleware
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000, function() {
        console.log("I am listening...");
    });
});