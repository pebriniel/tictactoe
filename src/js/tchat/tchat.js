
const chat = function(){
    var form = document.querySelector("#chat");

    console.log(form);
     // … et prenez en charge l'événement submit.
     form.addEventListener("submit", function (event) {
         event.preventDefault();

         const m = document.querySelector("#m");
         socket.emit('chat message', m.value);
         m.value = '';
     });


     var form = document.querySelector("#formUsername");
     form.addEventListener("submit", function (event) {
         event.preventDefault();

         const username = document.querySelector("#username");
         socket.emit('chat username', username.value);
         username.value = '';
     });

     socket.on('chat message', function(msg){
         let li = document.createElement("li");
         li.innerHTML = msg;
         messages.appendChild(li);
       // window.scrollTo(0, document.body.scrollHeight);
     });
}
