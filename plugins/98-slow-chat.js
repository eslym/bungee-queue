module.exports = function (server, handler, settings){
    if(settings.queueChat.enable && settings.queueChat.slowMode){
        
        handler.onBind(function(client,data, next){
            client.lastChat = moment().subtract(settings.queueChat.slowDelay);
        });

        handler.on('chat', function(client, data, next){
            if(client.lastChat.clone().add(settings.queueChat.slowDelay).isAfter(moment())){
                client.write('chat', {
                    message: JSON.stringify(settings.queueChat.tooFast),
                    position: 1
                });
                return;
            }
            next(client, data);
            client.lastChat = moment();
        });
    }
}