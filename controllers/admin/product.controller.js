const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    }
    if(req.query.status) find.status = req.query.status;

    // Tim kiem
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // Pagination
    let objectPagination = {
        currentPage: 1,
        limitItems: 4
    };
    if(req.query.page &&!isNaN(req.query.page) && req.query.page > 0){
        objectPagination.currentPage = parseInt(req.query.page);
    }
    objectPagination.skip = (objectPagination.currentPage-1)*objectPagination.limitItems;
    // console.log(objectPagination.currentPage);

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    // End Pagination 

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    // console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}