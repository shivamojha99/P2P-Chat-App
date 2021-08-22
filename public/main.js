const socket = io();
const form = document.getElementById("form")
const name1 = document.getElementById("name")
const age = document.getElementById("age")
const pre_form = document.getElementById("pre_form")
const messageInput= document.getElementById("msg-input")
const quit= document.getElementById('quit');

socket.on('connect',()=>{
   console.log(socket.id);
})

socket.on('after_quit',()=>{

    window.location.reload();
})

socket.on('wait',(wait_msg)=>{
    console.log(wait_msg);
    const para= document.createElement("p");
    para.innerHTML=wait_msg;
    
    const element = document.getElementById("chat-screen");
    element.appendChild(para);
})

function display(msg)
{
    const para= document.createElement("p");
    para.innerHTML="You :" + msg;
    
    const element = document.getElementById("chat-screen");
    element.appendChild(para);
}


quit.addEventListener("click",()=>{
    socket.emit('quit',socket.id);
})


form.addEventListener("submit",e=>{
    e.preventDefault()
    const message= messageInput.value;
    if(message==="")return;
    socket.emit('msg',message,socket.id)
        display(message);
    
    messageInput.value='';
})

socket.on('receive',(msg)=>{

    const para= document.createElement("p");
    para.innerHTML="Stranger :" + msg;
    
    const element = document.getElementById("chat-screen");
    element.appendChild(para);

})

