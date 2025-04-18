const User = require("../../models/user.model");

module.exports = async(req, res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async(userId) => {
            const myUserId = res.locals.user.id;

            // TH1 
            const existUser = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });

            if(!existUser){
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {acceptFriends: myUserId}
                });
            }

            // TH2 
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            });

            if(!existUserBInA){
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {requestFriends: userId}
                });
            }
        });
    });
}