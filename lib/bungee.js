const proto = new (require('protodef').ProtoDef)();

proto.addType('bungee:string', [
    "pstring",
    {
        countType: "u16"
    }
]);

proto.addType('bungee:buffer', [
    "buffer",
    {
        countType: "u16"
    }
]);

proto.addType('bungee:response', [
    "container", [
        {
            name: "action",
            type: "bungee:string",
        },
        {
            anon: true,
            type: [
                "switch", {
                    compareTo: "action",
                    fields: {
                        PlayerCount: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                },
                                {
                                    name: "count",
                                    type: "i32"
                                }
                            ]
                        ],
                        IP: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                },
                                {
                                    name: "ip",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        PlayerList: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                },
                                {
                                    name: "players",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        GetServers: [
                            "container", [
                                {
                                    name: "servers",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        GetServer: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        Forward: [
                            "container", [
                                {
                                    name: "channel",
                                    type: "bungee:string"
                                },
                                {
                                    name: "data",
                                    type: "bungee:buffer"
                                }
                            ]
                        ],
                        ForwardToPlayer: [
                            "container", [
                                {
                                    name: "channel",
                                    type: "bungee:string"
                                },
                                {
                                    name: "data",
                                    type: "bungee:buffer"
                                }
                            ]
                        ],
                        UUID: [
                            "container", [
                                {
                                    name: "uuid",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        UUIDOther: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                },
                                {
                                    name: "uuid",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        ServerIP: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                },
                                {
                                    name: "ip",
                                    type: "bungee:string"
                                },
                                {
                                    name: "port",
                                    type: "u16"
                                }
                            ]
                        ],
                        default: [
                            "container", []
                        ]
                    }
                }
            ]
        }
    ]
]);

proto.addType("bungee:request", [
    "container", [
        {
            name: "action",
            type: "bungee:string"
        },
        {
            anon: true,
            type: [
                "switch", {
                    compareTo: "action",
                    fields: {
                        Connect: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        ConnectOther: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                },
                                {
                                    name: "server",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        PlayerCount: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        PlayerList: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        Message: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                },
                                {
                                    name: "message",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        Forward: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                },
                                {
                                    name: "channel",
                                    type: "bungee:string"
                                },
                                {
                                    name: "data",
                                    type: "bungee:buffer"
                                }
                            ]
                        ],
                        ForwardToPlayer: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                },
                                {
                                    name: "channel",
                                    type: "bungee:string"
                                },
                                {
                                    name: "data",
                                    type: "bungee:buffer"
                                }
                            ]
                        ],
                        UUIDOther: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        ServerIP: [
                            "container", [
                                {
                                    name: "server",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        KickPlayer: [
                            "container", [
                                {
                                    name: "player",
                                    type: "bungee:string"
                                },
                                {
                                    name: "reason",
                                    type: "bungee:string"
                                }
                            ]
                        ],
                        default: [
                            "container", []
                        ]
                    }
                }
            ]
        }
    ]
]);

module.exports = function(client){
    if(client.bungeeHandler !== undefined){
        return client.bungeeHandler;
    }
    client.registerChannel('bungeecord:main');
    client.on('bungeecord:main', function(buffer){
        let data = proto.parsePacketBuffer("bungee:response", buffer).data;
        client.emit('bungeecord:'+data.action, data);
    });
    client.on('custom_payload', function(){});
    return client.bungeeHandler = {
        write: function (action, data){
            data.action = action;
            let buff = proto.createPacketBuffer('bungee:request', data);
            client.write('custom_payload', {
                channel: 'bungeecord:main',
                data: buff
            });
            return client.bungeeHandler;
        },
        connect: function (server) {
            return client.bungeeHandler.write('Connect', {server});
        },
        connectOther: function (player, server) {
            return client.bungeeHandler.write('ConnectOther', {player, server});
        },
        ip: function () {
            return client.bungeeHandler.write('IP', {});
        },
        playerCount: function (server){
            return client.bungeeHandler.write('PlayerCount', {server});
        },
        playerList: function (server){
            return client.bungeeHandler.write('PlayerList', {server});
        },
        getServers: function (){
            return client.bungeeHandler.write('GetServers', {});
        },
        message: function (player, message){
            return client.bungeeHandler.write('Message', {player, message});
        },
        getServer: function (){
            return client.bungeeHandler.write('GetServer', {});
        },
        forward: function (server, channel, data){
            return client.bungeeHandler.write('Forward', {server, channel, data});
        },
        forwardToPlayer: function (player, channel, data){
            return client.bungeeHandler.write('ForwardToPlayer', {player, channel, data});
        },
        uuid: function (){
            return client.bungeeHandler.write('UUID', {});
        },
        uuidOther: function (player){
            return client.bungeeHandler.write('UUIDOther', {player});
        },
        serverIp: function (server){
            return client.bungeeHandler.write('ServerIP', {server});
        },
        kickPlayer: function (player, reason){
            return client.bungeeHandler.write('KickPlayer', {player, reason});
        }
    };
};