const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

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