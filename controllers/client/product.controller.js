const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");

// [GET] /products 
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
    .sort({position: "asc"});

    const newProducts = productsHelper.priceNewProducts(products);
    // console.log(products);
    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted : false,
            status: "active",
            slug: req.params.slug
        };
        const product = await Product.findOne(find);
        if(!product){
            return res.redirect("/products");
        }
        res.render("client/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch(error){
        res.redirect("/products");
    }
    
}