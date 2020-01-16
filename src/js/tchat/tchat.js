
const chat = function(channel = 'chat'){
    let form = document.querySelector("#chat");

    if(form){
        // … et prenez en charge l'événement submit.
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const m = document.querySelector("#m");
            socket.emit(`${channel} message`, m.value);
            m.value = '';
        });

        socket.on(`${channel} message`, function(msg){
            pushMessage({type: 'message', message: msg});
            // let li = document.createElement("li");
            // li.innerHTML = msg;
            // messages.appendChild(li);
        });
    }

     let formUsername = document.querySelector("#formUsername");
     if(formUsername){
         formUsername.addEventListener("submit", function (event) {
             event.preventDefault();

             const username = document.querySelector("#username");
             socket.emit(`${channel} username`, username.value);
             username.value = '';
         });
     }
}


const pushMessage = function(message) {
    let messages = document.querySelector('#messages');

    if(messages){
        let li = document.createElement("li");
        li.classList.add(`type-${message.type}`);

        li.innerHTML = message.message;
        messages.appendChild(li);

        containerMessage.scrollTop = containerMessage.scrollHeight;
    }
}
