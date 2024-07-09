const { Server } = require("socket.io");
const io=new Server(8000,
    {
        cors:true
    }
)
const idtoemail=new Map();
const emailtoid=new Map();

io.on('connection', (socket) => {
    console.log(socket.id+' a user connected');


    socket.on('room:join',data=>{
        idtoemail.set(socket.id,data.email);
        emailtoid.set(data.email,socket.id);

        io.to(data.roomid).emit('user:joined',{email:data.email,id:socket.id});
        socket.join(data.roomid);
        //var room = io.sockets.adapter.rooms[data.roomid+""];
        //console.log("currently connected users: "+Object.keys(room).length);
        io.to(socket.id).emit('room:join',data);
        console.log(data);
    });

socket.on('user:call',({to,offer})=>{
    console.log("call received");
    io.to(to).emit('incoming:call',{from:socket.id,offer})
});

socket.on('call:accepted',({to,ans})=>{
    io.to(to).emit("call:accepted",{from:socket.id,ans});
})

socket.on("peer:nego:needed",({to,offer})=>{
    io.to(to).emit("peer:nego:needed",{from:socket.id,offer});
})

socket.on("peer:nego:done",({to,ans})=>{
    io.to(to).emit("peer:nego:final",{from:socket.id, ans});
})

  });
  
