const express=require('express')
const path=require('path')
const http=require('http')
const cors = require('cors')
const socketio=require('socket.io')
const {generatemessage,generateurl}=require('./utils/message')
const {addUser,removeUser,getUser,getUserinRoom}=require('./utils/users')
const { read } = require('fs')
const app=express()
app.use(cors())
const Port=process.env.Port||3000
const publicDirectoryPath=path.join(__dirname,'../public')
const server=http.createServer(app)
app.use(express.static(publicDirectoryPath))
const io=socketio(server)
io.on('connection',(socket)=>{
    console.log('new connection established')
   
    socket.on('join',(options,callback)=>{
       const {error,user} = addUser({id:socket.id,...options})
        if(error){
         return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generatemessage("HeyBOT®",'welcome'))
        socket.broadcast.to(user.room).emit('message',generatemessage("HeyBOT®",`${user.Username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserinRoom(user.room)
        })
        callback()
    })
    socket.on('sendmessage',(msg,callback)=>{
        const user=getUser(socket.id)
   
    io.to(user.room).emit('message',generatemessage(user.Username,msg))
    callback()
    })
    socket.on('sendlocation',(loc,callback)=>{
        const user=getUser(socket.id)
    io.to(user.room).emit('sendlocation',generateurl(user.Username,loc))
    callback()
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generatemessage("HeyBOT®",`${user.Username} has left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserinRoom(user.room)
            })
        }
    })
})
app.listen(Port,()=>{
    console.log(`app is listed on ${Port}`)
})
server.listen(Port,()=>{
    console.log(`app is listed on ${Port}`)
})