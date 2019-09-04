module.exports = function (server, handler, settings){
    if(settings.queueChat.enable){
        handler.on('chat', function(client, data, next){
            Object.values(server.clients).forEach((target) => {
                target.write('chat', {
                    message: JSON.stringify([
                        {
                            translate: 'chat.type.text',
                            with: [
                                client.username,
                                data.message,
                            ]
                        }
                    ]),
                    position: 0,
                });
                if (data.message === 'creeper?') {
                    target.write('chat', {
                        message: JSON.stringify([
                            {
                                text: "Aww Man!",
                                color: "yellow",
                            }
                        ]),
                        position: 0,
                    });
                }
            });
            next(client, data);
        });
    }
}