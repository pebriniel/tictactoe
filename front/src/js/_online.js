

var Online = {
    online: false,

    sendAction: function(action){
        socket.emit('game action', action);
    },

    sendActionSpecific: function(action, value){
        socket.emit(action, value);
    }
}
