const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html", err =>{
        if(err) throw err;
    });
});

app.get('/style.css',(req,res)=>{
    res.sendFile(__dirname + '/css/style.css');
});

conectados = [];
io.on('connection', (socket) =>{
    console.log('New connection accepted');

    socket.on('user connected', user=>{
	conectados.push({name: user.name,id:socket.id});
        io.emit('user connected',user.name + ' entrou');
        console.log(conectados);
        for(var i in conectados){
            io.to(conectados[i].id).emit('welcome',conectados);
        }
    });

    // socket.on('senfile', (data)=>{
    //     console.log("Received data:" + data);
    // });
    
    console.log(conectados); 
    
  
    socket.on('send',(user)=>{
        if(user.to) 
            io.to(user.to).to(socket.id).emit('recv',user.name+": "+user.message);
        else
            io.emit('recv',user.name+ ": "+ user.message);
    });

    socket.on('disconnect',()=>{
        console.log('Um usuário deixou a sala ' + socket.id);
        var count = 0;
        conectados.forEach(element => {
                if(element.id == socket.id){
                    io.emit('leave',socket.id);
                    conectados.splice(count,1);
                }
                count++;
        });

        console.log(conectados);
    });
});

http.listen(80, ()=>{
    console.log('Server running on port 80');
});
