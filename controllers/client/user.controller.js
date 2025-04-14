const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

const md5 = require('md5');
// [GET] /user/register
module.exports.register = async(req, res) => {
    res.render('client/pages/user/register', {
        pageTitle: "Đăng ký tài khoản"
    });
};

// [POST] /user/register
module.exports.registerPost = async(req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail){
        req.flash("error", "Email đã tồn tại!");
        res.redirect('back');
        return;
    }
    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
};

// [GET] /user/login
module.exports.login = async(req, res) => {
    res.render('client/pages/user/login', {
        pageTitle: "Đăng nhập tài khoản"
    });
}

// [POST] /user/login
module.exports.loginPost = async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash('error', "Email không tồn tại!");
        res.redirect('back');
        return;
    }

    if(md5(password) != user.password){
        req.flash('error', 'Sai mật khẩu');
        res.redirect('back');
        return;
    }

    if(user.status == "inactive"){
        req.flash('error', 'Tài khoản đang bị khóa');
        res.redirect('back');
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    });

    res.redirect("/");
}


// [GET] /user/logout
module.exports.logout = async(req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async(req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async(req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash('error', "Email không tồn tại!");
        res.redirect('back');
        return;
    }

    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 180*1000)
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = `MÃ OTP XÁC MINH LẤY LẠI MẬT KHẨU`;
    const html = `
        Mã OTP xác minh lấy lại mật khẩu là : <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không để lộ mã OTP
    `;
    sendMailHelper.sendMail(email, subject, html);


    res.redirect(`/user/password/otp?email=${email}`);
}

// [GET] /user/password/otp
module.exports.otpPassword = async(req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async(req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        req.flash('error', 'otp không hợp lệ');
        res.redirect('back');
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
      pageTitle: "Đổi mật khẩu mới"
    });
}

// [POST] /user/password/reset 
module.exports.resetPasswordPost = async(req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })

    res.redirect("/");
}

// [GET] /user/profile
module.exports.profile = async (req, res) => {
    res.render("client/pages/user/profile", {
      pageTitle: "Thông tin cá nhân"
    });
  };