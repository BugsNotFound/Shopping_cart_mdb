const Product = require("../models/product");

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.fetchAll()
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
    req.user.getCart()
        .then(products => {
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
            console.log(result);
            res.redirect("/cart");
        });
}

module.exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
}


module.exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders"
    });
}

module.exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout"
    })
}