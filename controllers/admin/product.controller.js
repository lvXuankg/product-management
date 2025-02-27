const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );
    
    // End Pagination 

    const products = await Product.find(find).sort({position: "asc"}).limit(objectPagination.limitItems).skip(objectPagination.skip);

    // console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id}, {status : status});

    req.flash('success', 'Cập nhật sản phẩm thành công!');
    
    res.redirect("back");
}

// [PATCH] /admin/products/change-multi 
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch(type){
        case "active":
            await Product.updateMany({_id: { $in : ids}}, {status: "active"});
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({_id: { $in : ids}}, {status: "inactive"});
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.updateMany(
                {_id: { $in : ids}}, 
                {
                    deleted: true,
                    deletedAt: new Date()
                })
            break;
        case "change-position":
            
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    // await Product.deleteOne({_id : id});
    await Product.updateOne(
        {_id: id}, 
        {
            deleted : true,
            deletedAt: new Date()
    });
    
    res.redirect("back");
}