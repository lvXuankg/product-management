// send request add friend
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            
            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// end send request add friend

// accept add friend
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        
        button.addEventListener("click", () => {
           
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// end accept add friend