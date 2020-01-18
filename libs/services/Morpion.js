const socket = require("./Socket.js");
const uniqid = require('uniqid');

class Morpion extends socket {

    constructor(getIOInstance)
    {
        super(getIOInstance);

        this.maxPlayer = 2;
    }

}

module.exports = function(getIOInstance){
    return new Morpion(getIOInstance);
};
