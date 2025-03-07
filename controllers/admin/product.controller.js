const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
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

    // Sort 
    let sort = {};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "asc";
    }
    

    // End Sort 

    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

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
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm!`);
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
    req.flash('success', `Đã xóa thành công sản phẩm!`);
    
    res.redirect("back");
}

// [GET] /admin/products/create 
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const category = createTreeHelper.tree(records);
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: category
    });
}

// [POST] /admin/products/create 
module.exports.createPost = async (req, res) => {
    // console.log(req.file);
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else{
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const find = {
            deleted: false,
            _id: id
        };
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        })
    } catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
    
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.position = parseInt(req.body.position);
 
    
    try{
        await Product.updateOne({_id: req.params.id},req.body)
        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch(error) {
        req.flash("error", "Cập nhật sản phẩm thất bại!");
    }
    
    res.redirect('back');
}

// [GET] /admin/products/detail/:id 
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);
        // console.log(product);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch(error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}