const moment = require('moment');

module.exports = function (server, handler, settings){
    if(settings.queueChat.enable && settings.queueChat.slowMode){
        handler.onBind(function(next){
            this.client.lastChat = moment().subtract(settings.queueChat.slowDelay);
            next();
        });

        handler.on('chat', function(next){
            let client = this.client;
            if(client.lastChat.clone().add(settings.queueChat.slowDelay).isAfter(moment())){
                client.write('chat', {
                    message: JSON.stringify(settings.queueChat.tooFast),
                    position: 1
                });
                return;
            }
            next();
            client.lastChat = moment();
        });
    }
}