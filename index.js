const mc = require('minecraft-protocol');
const settings = require('./settings.json');
const bungee = require('bungeecord-message');
const util = require('util');
const moment = require('moment');

let server = mc.createServer({
    'online-mode': false,
    encryption: true,
    host: settings.host,
    port: settings.port,
    version: settings.version,
    maxPlayers: settings.maxInQueue,
});

server.on('login', function (client) {
    client.write('login', {
        entityId: client.id,
        levelType: 'default',
        gameMode: 0,
        dimension: 0,
        difficulty: 0,
        maxPlayers: settings.maxPlayers,
        reducedDebugInfo: false
    });
    if(settings.queueChat.slowMode){
        client.lastChat = moment().subtract(settings.queueChat.slowDelay);
    }
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
        position: 1,
    });
    bungee(client);
    client.on('bungeecord:PlayerCount', function (data) {
        if (
            data.server === settings.targetServer &&
            data.count < settings.maxPlayers
        ) {
            if (Object.values(server.clients).length > 0) {
                first = Object.values(server.clients)[0];
                first.write('chat', {
                    message: JSON.stringify(settings.text.enteringGame),
                    position: 1,
                });
                bungee(first).connect(settings.targetServer);
            }
        }
    });
    if (settings.queueChat.enable) {
        client.on('chat', function (data) {
            if(settings.queueChat.slowMode && client.lastChat.clone().add(settings.queueChat.slowDelay).isAfter(moment())){
                client.write('chat', {
                    message: JSON.stringify(settings.queueChat.tooFast),
                    position: 1
                });
                return;
            }
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
            if(settings.queueChat.slowMode){
                client.lastChat = moment();
            }
        });
    }
    client.on('end', updateQueue);
    client.on('error', updateQueue);
    notifyQueue(client, Object.values(server.clients).length);
});

setInterval(function () {
    let clients = Object.values(server.clients);
    for (let client of clients) {
        if (client.state === mc.states.PLAY) {
            bungee(client).playerCount(settings.targetServer);
            break;
        }
    }
}, 200);

function updateQueue() {
    Object.values(server.clients).forEach((client, index) => {
        notifyQueue(client, index + 1);
    });
}

function notifyQueue(client, number) {
    if (client.state === mc.states.PLAY) {
        if (number <= settings.soundNotify.since) {
            client.write('named_sound_effect', {
                soundName: settings.soundNotify.sound,
                soundCategory: "master",
                x: 0,
                y: 1.62,
                z: 0,
                volume: 1,
                pitch: 1
            });
        }
        client.write('chat', {
            message: JSON.stringify({
                text: util.format(settings.text.queueNumber, number)
            }),
            position: 1
        });
        client.write('experience', {
            experienceBar: 0,
            level: number,
            totalExperience: 0,
        })
    }
}