const mc = require('minecraft-protocol');
const settings = require('./settings.json');
const bungee = require('./lib/bungee');
const util = require('util');

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
    client.registerChannel('bungeecord:main');
    client.on('bungeecord:main', function (buffer) {
        let data = bungee.parsePacketBuffer("bungee:response", buffer).data;
        if (
            data.action === "PlayerCount" &&
            data.server === settings.targetServer &&
            data.count < settings.maxPlayers
        ) {
            if (Object.values(server.clients).length > 0) {
                var first = Object.values(server.clients)[0];
                let buff = bungee.createPacketBuffer("bungee:request", {
                    action: "Connect",
                    server: settings.targetServer
                });
                first.write('chat', {
                    message: JSON.stringify(settings.text.enteringGame),
                    position: 1,
                });
                first.write('custom_payload', {
                    channel: 'bungeecord:main',
                    data: buff,
                });
            }
        }
    });
    client.on('chat', function (data) {
        if (settings.queueChat) {
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
        }
    });
    client.on('end', updateQueue);
    client.on('error', updateQueue);
    notifyQueue(client, Object.values(server.clients).length);
});

setInterval(function () {
    let clients = Object.values(server.clients);
    for (let client of clients) {
        if (client.state === mc.states.PLAY) {
            let buff = bungee.createPacketBuffer("bungee:request", {
                action: "PlayerCount",
                server: settings.targetServer
            });
            client.write('custom_payload', {
                channel: 'bungeecord:main',
                data: buff,
            });
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