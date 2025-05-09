const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");
// [GET] /users/not-friend 
module.exports.notFriend = async (req, res) => {
  // Socket 
  usersSocket(req, res);
  // end Socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id : userId
  });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  // $ne: not equal

  const users = await User.find({
    $and : [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } }
    ],
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend", {
      pageTitle: "Danh sách người dùng",
      users: users
  });
};

// [GET] /users/request
module.exports.request = async(req, res) => {
  // SocketIO
  usersSocket(req, res);
  // End SocketIO

  // $in: in

  const requestFriends = res.locals.user.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
};