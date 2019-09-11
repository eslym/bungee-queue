const Chain = require('./chain');

let globalHandlers = {};
let bindListener = new Chain();

function Handler(client){
    let handlers = {};
    let instance = this;

    this.on = function(event, handler){
        if(handlers.hasOwnProperty(event)){
            handlers[event].pipe(handler);
        } else {
            handlers[event] = new Chain(handler);
            client.on(event, function(...args){
                handlers[event].run(instance, ...args);
            })
        }
        return this;
    };

    this.once = function(event, handler){
        if(handlers.hasOwnProperty(event)){
            handlers[event].pipeOnce(handler);
        } else {
            handlers[event] = new Chain(handler);
            client.on(event, function(...args){
                handlers[event].run(instance, ...args);
            })
        }
        return this;
    }

    for(let event in globalHandlers){
        handlers[event] = globalHandlers[event].clone();
        client.on(event, function(...args){
            handlers[event].run(instance, ...args);
        })
    }

    this.client = client;
    bindListener.run(this);
}

Handler.onBind = function(handler){
    bindListener.pipe(handler);
}

Handler.on = function(event, handler){
    if(globalHandlers.hasOwnProperty(event)){
        globalHandlers[event].pipe(handler);
    } else {
        globalHandlers[event] = new Chain(handler);
    }
    return Handler;
}

Handler.of = function(client){
    if(client.hasOwnProperty('pluginHandler')){
        return client.pluginHandler;
    }
    return client.pluginHandler = new Handler(client);
}

module.exports = Handler;