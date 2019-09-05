function Chain(callback = null) {
    let callbacks = [];

    if(callback instanceof Array){
        callbacks = Array.from(callback);
    }else if(callback instanceof Function){
        callbacks.push(callback);
    }

    this.run = function (thisArg, ...args) {
        let fns = callbacks.concat([function(){}]);
        let run = function () {
            return fns.shift().apply(thisArg, [run].concat(args));
        };
        return run();
    };

    this.pipe = function (callback) {
        callbacks.push(callback);
        return this;
    };

    this.clone = function () {
        return new Chain(callbacks);
    }
}
module.exports = Chain;