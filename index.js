const mc = require('minecraft-protocol');
const settings = require('./settings.json');
const bungee = require('bungeecord-message');
const util = require('util');
const fs = require('fs');
const path = require('path');
const Handler = require('./classes/handler');

let server = mc.createServer({
    'online-mode': false,
    encryption: true,
    host: settings.host,
    port: settings.port,
    version: settings.version,
    maxPlayers: settings.maxInQueue,
});

const handler = new Handler();

for(let plugin of fs.readdirSync(path.join(__dirname, 'plugins'), 'utf-8')){
    if(!plugin.endsWith('.js')) continue;
    require(plugin)(server, handler, settings);
}

server.on('login', function (client) {
    handler.bind(client);
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
    bungee(client);
    handler.on('bungeecord:PlayerCount', function (data) {
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
    handler.on('end', updateQueue);
    handler.on('error', updateQueue);
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