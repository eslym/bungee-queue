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

module.exports = proto;