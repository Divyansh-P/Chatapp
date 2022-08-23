const generatemessage=(Username,msg)=>{
return {
    Username:Username,
    text:msg,
    createdAt:new Date().getTime()
}
}
const generateurl=(Username,msg)=>{
    return {
        Username:Username,
        url:msg,
        createdAt:new Date().getTime()
    }
}
module.exports={
    generatemessage,generateurl
}