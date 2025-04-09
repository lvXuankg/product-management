const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const categorymiddleware = require("../../middlewares/client/category.middleware");
const cartMiddeware = require("../../middlewares/client/cart.middleware");
const checkoutRoutes = require("./checkout.route");

module.exports = (app) => {
    app.use(categorymiddleware.category);

    app.use(cartMiddeware.cartId);

    app.use("/", homeRoutes);
    
    app.use("/products", productRoutes);
    
    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutRoutes);
}