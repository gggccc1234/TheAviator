const EMessageType = {
    impartEnnemy: 1,
}

function MessageController() {
    this.messageHandler = {};
}

MessageController._instance = null;

MessageController.getInstance = function () {
    if (!MessageController._instance) {
        MessageController._instance = new MessageController();
    }
    return MessageController._instance;
}

MessageController.prototype.checkProcessList = function() {
    let keys = Object.keys(this.MessageController);
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        console.warn(EMessageType[i] + ' C: ' + this.messageHandler[i].length);
    }
}

MessageController.prototype.dispatch = function(rEvent, rMessage) {
    if (this.messageHandler[rEvent]) {
        this.messageHandler[rEvent].forEach(hander => {
            try {
                handler(rMessage);
            } catch (error) {
                console.error("abnormal dispatch", error);
                console.trace();
            }
        })
    }
}

MessageController.prototype.observe = function(rEvent, rHandler) {
    if (this.messageHandler[rEvent] == null) {
        this.messageHandler[rEvent] = [];
    }
    let index = this.messageHandler[rEvent].findIndex(handler => {
        return handler == rHandler;
    })
    if (index != -1) {
        console.log("handler has exist");
        return this.messageHandler[rEvent][index];
    }
    this.messageHandler[rEvent].push(rHandler);
    return rHandler;
}

MessageController.prototype.remove = function(rEvent, rHandler) {
    if (this.messageHandler[rEvent] == null) {
        return;
    }
    let index = this.messageHandler[rEvent].findIndex(handler => {
        return handler == rHandler;
    })
    if (index != 0) {
        this.messageHandler[rEvent].splice(index, 1);
    }
}

MessageController.prototype.removeAllByEvent = function(rEvent) {
    if (this.messageHandler[rEvent] == null) {
        return;
    }
    for (let index = 0; index < this.messageHandler[rEvent].length; index++) {
        this.messageHandler[rEvent][index] = null;
    }
    this.messageHandler[rEvent] = null;
}