import { Client } from "minecraft-protocol";

/**
 * BungeeCord Handler
 */
interface BungeeHandler{
    /**
     * Connects a player to said subserver.
     * @param server server name
     */
    connect(server :string): BungeeHandler;

    /**
     * Connect a named player to said subserver.
     * @param player player name
     * @param server server name
     */
    connectOther(player :string, server :string): BungeeHandler;

    /**
     * Get the (real) IP of a player.
     */
    ip(): BungeeHandler;

    /**
     * Get the amount of players on a certain server, or on ALL the servers.
     * @param server server name, ALL for all players count
     */
    playerCount(server :string): BungeeHandler;

    /**
     * Get a list of players connected on a certain server, or on ALL the servers.
     * @param server server name, ALL for all players list
     */
    playerList(server :string): BungeeHandler;

    /**
     * Get a list of server name strings, as defined in BungeeCord's config.yml
     */
    getServers(): BungeeHandler;

    /**
     * Send a message (as in, a chat message) to the specified player.
     * @param player player name, ALL to send to all players
     * @param message message to send
     */
    message(player :string, message :string): BungeeHandler;

    /**
     * Get this server's name, as defined in BungeeCord's config.yml
     */
    getServer(): BungeeHandler;

    /**
     * Send a custom plugin message to said server.
     * @param server server name, ALL to send to all servers
     * @param channel subchannel for plugin usage
     * @param data message to send
     */
    forward(server :string, channel :string, data :Buffer): BungeeHandler;

    /**
     * Send a custom plugin message to specific player.
     * @param player player name
     * @param channel subchannel for plugin usage
     * @param data message to send
     */
    forwardToPlayer(player :string, channel :string, data :Buffer): BungeeHandler;

    /**
     * Request the UUID of this player.
     */
    uuid(): BungeeHandler;

    /**
     * Request the UUID of any player connected to the BungeeCord.
     * @param player player name
     */
    uuidOther(player :string): BungeeHandler;
    
    /**
     * Request the IP of any server on BungeeCord.
     * @param server server name
     */
    serverIp(server :string): BungeeHandler;

    /**
     * Kick any player on BungeeCord.
     * @param player player name
     * @param reason reason of kick
     */
    kickPlayer(player :string, reason :string): BungeeHandler;
}

/**
 * Wrap client with BungeeHandler
 * @param client the client
 */
export default function bungee(client: Client): BungeeHandler;