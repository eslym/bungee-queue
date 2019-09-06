const mc = require('minecraft-protocol');
const settings = require('./settings.json');
const bungee = require('bungeecord-message');
const util = require('util');
const fs = require('fs');
const path = require('path');
const Handler = require('./classes/handler');

let queue = {};
let pending = {};

let server = mc.createServer({
    'online-mode': false,
    encryption: true,
    host: settings.host,
    port: settings.port,
    version: settings.version,
    maxPlayers: settings.maxInQueue,
});

const pluginPath = path.join(__dirname, 'plugins');
for(let plugin of fs.readdirSync(pluginPath, 'utf-8')){
    if(!plugin.endsWith('.js')) continue;
    require(path.join(pluginPath, plugin))(server, Handler, settings);
}

Handler.on('bungeecord:PlayerCount', function (next, data) {
    if (
        data.server === settings.targetServer &&
        (data.count + Object.values(pending).length) < settings.maxPlayers
    ) {
        if (Object.values(queue).length > 0) {
            first = Object.values(queue)[0];
            delete queue[this.client.id];
            pending[first.id] = this.client.id;
            first.write('chat', {
                message: JSON.stringify(settings.text.enteringGame),
                position: 1,
            });
            bungee(first).connect(settings.targetServer);
        }
    }
});

Handler.on('end', updateQueue);
Handler.on('error', updateQueue);

Handler.onBind(function (){
    this.client.write('login', {
        entityId: this.client.id,
        levelType: 'default',
        gameMode: 0,
        dimension: 0,
        difficulty: 0,
        maxPlayers: settings.maxPlayers,
        reducedDebugInfo: false
    });
    this.client.write('position', {
        x: 0,
        y: 1.62,
        z: 0,
        yaw: 0,
        pitch: 0,
        flags: 0x00
    });
    this.client.write('chat', {
        message: JSON.stringify(settings.text.welcome),
        position: 1,
    });
    queue[this.client.id] = this.client;
    bungee(this.client);
    notifyQueue(this.client, Object.values(queue).length);
});

server.on('login', Handler.of);

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
    delete queue[this.client.id];
    delete pending[this.client.id];
    Object.values(queue).forEach((client, index) => {
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