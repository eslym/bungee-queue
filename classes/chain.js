function Chain(callback) {
    let callbacks = [callback];
    this.run = function (client, data) {
        let fns = callbacks.concat([(a, b, c) => { }]);
        let run = function (client, data) {
            fns.shift()(client, data, run);
        };
        run(client, data);
    };
    this.pipe = function (callback) {
        callbacks.push(callback);
        return this;
    };
}
module.exports = Chain;