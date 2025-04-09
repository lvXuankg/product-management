const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /cart
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
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail : cart
    });
}

// [POST] /cart/add/:productId 
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId
    });
    // console.log(cart.products);

    const existProductInCart = cart.products.find(item => item.product_id == productId);

    // console.log(existProductInCart);

    if(existProductInCart){
        console.log("cập nhật quantity ");  
        const newQuantity = quantity + existProductInCart.quantity;
        // console.log(newQuantity);

        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        },{
            'products.$.quantity': newQuantity
        });

        req.flash("success", "Cập nhật giỏ hàng thành công!");
        res.redirect("back");

    } else {
        const objectCart = {
            product_id : productId,
            quantity: quantity
        };

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        );
        req.flash("success", "Thêm vào giỏ hàng thành công!");
        res.redirect('back');
    }


}

// [GET] /cart/delete/:productId 
module.exports.delete = async(req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    console.log("----");
    console.log(cartId);
    console.log(productId);
    console.log("-----");
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull : {
            products: {
                product_id: productId
            }
        }
    });

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
    res.redirect('back');
}