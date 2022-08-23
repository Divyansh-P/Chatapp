const users=[]
const addUser=({id,Username,room})=>{
Username=Username.trim().toLowerCase()
room=room.trim().toLowerCase()
if(!Username||!room){
    return {
        error:"Username and Room are required"
    }
}
const existinguser=users.find((user)=>{
return user.room===room && user.Username===Username
})
if(existinguser){
    return{
        error:'Username is not available'
    }
}
const user={id,Username,room}
users.push(user)
return {user}
}
const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}
const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}
const getUserinRoom=(room)=>{
return users.filter((user)=>user.room===room)
}
module.exports={
     addUser,
     removeUser,
     getUser,
     getUserinRoom
}
