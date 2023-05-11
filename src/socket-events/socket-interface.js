
const io = require("socket.io-client");
const socket = io("http://localhost:3000");

 class SocketEmitter {
  constructor(){

  }

socketSendMessageFuntion(){

  socket.on("connect", () => {
    console.log(socket.id);
    socket.emit("send-message", "fgdfgh", socket.id); // x8WIv7-mJelg7on_ALbx
 
  });

}
socketReceiveMessageFuntion(){
  socket.on("receive-message", message => {
    console.log(socket.id, message,"hi")
  })
}

}
let newClass =new SocketEmitter()
newClass.socketSendMessageFuntion()
newClass.socketReceiveMessageFuntion()

