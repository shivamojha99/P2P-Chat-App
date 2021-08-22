const path= require('path');
const http = require('http')
const express = require('express');
var bodyParser = require('body-parser');
const socketio = require('socket.io');
const { Socket } = require('dgram');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.urlencoded({
    extended: true
  }));

app.post('/', function (req, res) {

    console.log(req.body.name);
    console.log(req.body.age);
    res.sendFile(path.join(__dirname, '/public/chat.html'));
});
const hashmap = new Map([]);
waiting_users=[];
io.on('connection', socket=>{    
    console.log('New WS connection');
    console.log(socket.id);

    waiting_users.push(socket.id);
    console.log(waiting_users.length);
   

    if(waiting_users.length>=2)
    {
        const first_user=waiting_users.shift();
        const sec_user=waiting_users.shift();
        hashmap.set(first_user,sec_user)
        hashmap.set(sec_user,first_user)
        console.log('users list');
        console.log("1 " + first_user);
        console.log("2 " +   sec_user);

    }


    socket.on('msg',(message,id)=>{
        console.log("from "+ id + " to " + hashmap.get(id));
            socket.to(hashmap.get(id)).emit('receive',message);
        
    })

    socket.on('quit',(id)=>{
        const part= hashmap.get(id);

        hashmap.delete(id);
        hashmap.delete(part);
        waiting_users.push(id);
        waiting_users.push(part);
        socket.emit('after_quit');
    })

})
 

app.use(express.static(path.join(__dirname,'public')))
const PORT = 3000 || process.env.PORT;


server.listen(PORT,()=>
    console.log(`server running on ${PORT}`)
)