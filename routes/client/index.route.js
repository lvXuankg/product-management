const categorymiddleware = require("../../middlewares/client/category.middleware");
const cartMiddeware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");

module.exports = (app) => {
    app.use(categorymiddleware.category);

    app.use(cartMiddeware.cartId);

    app.use(userMiddleware.infoUser);

    app.use("/", homeRoutes);
    
    app.use("/products", productRoutes);
    
    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutRoutes);

    app.use("/user", userRoutes);

    app.use("/chat", authMiddleware.infoUser, chatRoutes);

    app.use("/users", authMiddleware.infoUser, usersRoutes);

}