const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb://himansh:himansh1@ds163757.mlab.com:63757/shopping_cart_mvc", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(client => {
            console.log("Connected!");
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found';
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;