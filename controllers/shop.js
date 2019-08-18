const Product = require("../models/product");
const Order = require("../models/order");

module.exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products"
            });
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId').execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render("shop/cart", {
                path: '/cart',
                pageTitle: "Your Cart",
                products: products
            })
        });
}


module.exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        }).then(result => {
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
}

module.exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
}


module.exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            //console.log(orders[0].products);
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders
            });
        })
        .catch(err => console.log(err))
}

module.exports.postOrder = (req, res, next) => {
    req.user.populate("cart.items.productId").execPopulate()
        .then(user => {
            console.log("HEYY");
            console.log(user.cart.items);
            const products = user.cart.items.map(i => {
                return { product: {...i.productId._doc }, quantity: i.quantity };
            });
            console.log(products);
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user /*Mongoose will pick id*/
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch(err => console.log(err));
}

module.exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout"
    })
}