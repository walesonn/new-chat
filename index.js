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
    
    console.log(conectados); 
    
  
    socket.on('send',(user)=>{
        io.emit('recv',user.name+ ": "+ user.message);
    });

    socket.on('disconnect',()=>{
        io.emit('leave','Um usuário acaba de deixar na sala');
        console.log('Um usuário deixou a sala');
    });
});

http.listen(80, ()=>{
    console.log('Server running on port 80');
});
