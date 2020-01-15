

var Online = {
    online: false,

    sendAction: function(action){
        socket.emit('game action', action);
    }
}
