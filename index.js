const mc = require('minecraft-protocol');
const settings = require('./settings.json');
const bytearray = require('bytearray');
const util = require('util');

let server = mc.createServer({
    'online-mode': false,
    encryption: true,
    host: settings.host,
    port: settings.port,
    version: settings.version,
});

server.on('login', function(client){
    client.write('login', {
        entityId: client.id,
        levelType: 'default',
        gameMode: 3,
        dimension: 0,
        difficulty: 0,
        maxPlayers: 1,
        reducedDebugInfo: false
    });
    client.write('position', {
        x: 0,
        y: 1.62,
        z: 0,
        yaw: 0,
        pitch: 0,
        flags: 0x00
    });
    client.write('chat', {
        message: JSON.stringify(settings.text.welcome),
        position: 0,
    });
    client.on('custom_payload', function(data){
        if(data.channel === "bungeecord:main"){
            let offset = 0;
            let sub = bytearray.readUTF(data.data, offset);
            if(sub === "PlayerCount"){
                offset += sub.length + 2;
                let srv = bytearray.readUTF(data.data, offset);
                if(srv === settings.targetServer){
                    offset += srv.length + 2;
                    let count = bytearray.readInt(data.data, offset);
                    if(count < settings.maxPlayers){
                        let buff = Buffer.alloc(100);
                        bytearray.writeUTF(buff, "Connect");
                        bytearray.writeUTF(buff, settings.targetServer, 9);
                        if(Object.values(server.clients).length > 0) {
                            Object.values(server.clients)[0].write('custom_payload', {
                                channel: 'bungeecord:main',
                                data: buff,
                            });
                        }
                    }
                }
            }
        }
    });
    client.on('end', updateQueue);
    client.on('error', updateQueue);
    notifyQueue(client, Object.values(server.clients).length);
});

setInterval(function(){
    let clients = Object.values(server.clients);
    for(let client of clients){
        if(client.state === mc.states.PLAY) {
            let buff = Buffer.alloc(100);
            bytearray.writeUTF(buff, "PlayerCount");
            bytearray.writeUTF(buff, settings.targetServer, 13);
            client.write('custom_payload', {
                channel: 'bungeecord:main',
                data: buff,
            });
            break;
        }
    }
}, 200);

function updateQueue(){
    Object.values(server.clients).forEach((client, index)=>{
        notifyQueue(client, index + 1);
    });
}

function notifyQueue(client, number){
    if(client.state === mc.states.PLAY){
        client.write('chat', {
            message: JSON.stringify({
                text: util.format(settings.text.queueNumber, number),
                position: 0
            })
        });
    }
}