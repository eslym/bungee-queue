const Chain = require('./chain');

function Handler(){
    let handlers = {};
    let bindListener = new Chain((a, b, next)=>{ next(a, b); });

    this.on = function(event, handler){
        if(handlers.hasOwnProperty(event)){
            handlers[event].pipe(handler);
        } else {
            handlers[event] = new Chain(handler);
        }
        return this;
    };

    this.onBind = function(callback){
        bindListener.pipe(callback);
    }

    this.bind = function(client){
        for(let event in handlers){
            client.on(event, function(data){
                handlers[event].run(client, data);
            });
        }
        bindListener.run(client, null);
        return this;
    };
}

module.exports = Handler;