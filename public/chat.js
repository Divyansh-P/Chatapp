const io=require('socket.io-client')
const socket=io("https://divychatapp.herokuapp.com/", {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });
const msg_btn=document.querySelector('#msgbtn')
const btn=document.querySelector('#location')
const formin=document.querySelector('#inp')
const messageTemplate=document.querySelector('#message-template').innerHTML
const message=document.querySelector('#messages')
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

const {Username , room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
const $newMessage=message.lastElementChild
const newMessagesStyles=getComputedStyle($newMessage)
const newMessageMargin=parseInt(newMessagesStyles.marginBottom)
const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
const visibleHeight=message.offsetHeight
const containerHeight=message.scrollHeight
const scrollOffset=message.scrollTop+visibleHeight
if(containerHeight-newMessageHeight <= scrollOffset){
message.scrollTop=message.scrollHeight
}
}
socket.on('message',(msg)=>{
    console.log(msg)
    const html=Mustache.render(messageTemplate,{
        Username:msg.Username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('sendlocation',(msg)=>{
    console.log(msg)
    const html=Mustache.render(locationTemplate,{
       Username:msg.Username,
        message:msg.url,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
const form=document.querySelector('#farm')
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    msg_btn.setAttribute('disabled','disabled')
    const input=e.target.elements.message.value
    socket.emit('sendmessage',input,(error)=>{
        msg_btn.removeAttribute('disabled')
        formin.value=''
        formin.focus()
        if(error){
            return  console.log(error)
        }
        console.log('this message was delivered')
    })
})

btn.addEventListener('click',()=>{
    btn.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        btn.removeAttribute('disabled')
       const latitude=position.coords.latitude
       const longitude=position.coords.longitude
       socket.emit('sendlocation',`https://www.google.com/maps?q=${latitude},${longitude}`,()=>{
           console.log('location shared')
       })
    })
})
socket.emit('join',{Username,room},(error)=>{
   if(error){
    alert(error)
    location.href='/'
   } 
})


