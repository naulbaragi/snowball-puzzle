const express = require('express')
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const io = require('socket.io')(http,{
   cors:{
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
   }
});  
http.listen(8080, ()=> { console.log("server is on")});
// const path = require('path')
// after we start listening to our server, we can set up and attach our socket.io server
// const io = socketio(server)
// const fs = require('fs');
// in a separate file we'll get more specific about the events we want our socket server to listen for and broadcast

// app.use(express.static('build'));
app.use(cors({
   origin: "*", // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
   //  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
}));


app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
 });
 
 app.get("/", (req, res) => {
   res.send("server");
 });
io.on('connection', socket => {     
    socket.on('object-added', data => {         
       socket.broadcast.emit('new-add', data); 
       console.log('eee')   
    })

    socket.on('path-added', data => {         
      socket.broadcast.emit('new-addP', data); 
      console.log('path success');
      console.log(data);   
   })          
    
    socket.on('object-modified', data => {    
       socket.broadcast.emit('new-modification', data);    
    })      

    socket.on('object-deleted', data => {
      socket.broadcast.emit('deleteallcanvas', data);
      console.log("delete success")
    })

    socket.on('object-clear', data => {
      socket.broadcast.emit('clearcanvas', data);
      console.log('clear canvas')
    })

    socket.on('setup-puzzle', data => {
      socket.broadcast.emit('setupallpuzzle',data);
    })
 })
//  app.get('/', function (요청, 응답) {
//     응답.sendFile(path.join(__dirname, '/build/index.html'));
//   });