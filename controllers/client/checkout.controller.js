const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
// [GET] /checkout
module.exports.index = async(req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id : cartId
    });

    cart.totalPrice = 0;
    if(cart.products.length > 0){
        for(const product  of cart.products){
            const productId = product .product_id;

            const productInfo = await Product.findOne({
                _id : productId
            }).select("title thumbnail slug price discountPercentage");;

            productInfo.price = parseFloat(productInfo.price).toFixed(2);
            productInfo.priceNew = (1 - productInfo.discountPercentage/100) * productInfo.price;
            productInfo.priceNew = productInfo.priceNew.toFixed(2);
            product.productInfo = productInfo;
            product.totalPrice = productInfo.priceNew * product.quantity;
            cart.totalPrice += product.totalPrice;
        }
    }
    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail : cart
    });
};

// [POST] /checkout/order 
module.exports.order = async(req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id : cartId
    });

    let products = [];
    for (const product of cart.products) {
        const objectProduct = {
            product_id : product.id,
            quantity: product.quantity
        };
        const productInfo = await Product.findOne({
            _id : product.product_id
        });

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct);
    };

    const objectOrder = {
        cart_id : cartId,
        userInfo: userInfo,
        products: products
    }

    const order = new Order(objectOrder);
    await order.save();

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
}