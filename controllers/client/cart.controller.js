const Cart = require("../../models/cart.model");

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