const md5 = require('md5');
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

// [GET] /admin/accounts
module.exports.index = async (req,res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            deleted: false,
            _id: record.role_id
        });
        record.roleTitle = role.title;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

// [GET] /admin/accounts/create 
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted : false
    });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

// [POST] /admin/accounts/create 
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if(emailExist){
        req.flash("error", "Email đã tồn tại!");
        res.redirect('back');
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
  
    const account = await Account.findOne({
      _id: id,
      deleted: false
    });
  
    const roles = await Role.find({
      deleted: false
    }).select("title");
  
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chinh sửa tài khoản admin",
      roles: roles,
      account: account
    });
  }
  
  // [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: { $ne : id},
        email: req.body.email,
        deleted: false
    });

    if(emailExist){
        req.flash("error", "Email đã tồn tại!");
    } else {
        

        if(req.body.password == "") {
            delete req.body.password;
        } else {
            req.body.password = md5(req.body.password); 
        }

        await Account.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật thành công!");
    }

    res.redirect("back");
}