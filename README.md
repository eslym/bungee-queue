# Bungee Queue
A 2B2T-Like Queue System.

一个仿 2B2T 的排隊系統。

## Prerequisite
This system serve as a backend server for BungeeCord, it required BungeeCord to work.

此系統是一個利用BungeeCord機制來實現排隊的模擬麥塊伺服器，因此需要BungeeCord才能使用。

## Installation
### With Tmux
```bash
git clone --branch stable https://github.com/eslym/bungee-queue.git
cd bungee-queue
npm install
cp settings.json.example settings.json
node index.js
```
### With PM2 (Recommended)
```bash
git clone --branch stable https://github.com/eslym/bungee-queue.git
cd bungee-queue
npm install
cp settings.json.example settings.json
pm2 start index.js --name bungee-queue
pm2 save
```

## Features
1. Queue number shown as experience level
   
   排隊號碼以等級的方式顯示
2. Chat while queue (can enable/disable)
   
   排隊時聊天 （可開啟或禁用）
3. Sound notification when nearly join game
   
   當排隊號碼接近遊玩時的聲音提示

4. Slow mode chat
   
   限速聊天

## Configuration
| Path                | Type        | Description                                                                                       |
|---------------------|-------------|---------------------------------------------------------------------------------------------------|
| host                | string (ip) | Ip which queue server listening to                                                                |
| port                | int         | Port number which queue server listening to                                                       |
| version             | string      | Minecraft Version                                                                                 |
| targetServer        | string      | Target server in bungeecord                                                                       |
| maxInQueue          | int         | Max player allowed in queue                                                                       |
| maxPlayers          | int         | Max player allowed in target server                                                               |
| queueChat.enable    | boolean     | Enable chat in queue server                                                                       |
| queueChat.slowMode  | boolean     | Enable slow mode for chat                                                                         |
| queueChat.slowDelay | int         | Slow mode delay                                                                                   |
| queueChat.tooFast   | JSON Text   | Minecraft JSON Text to warn player when sending too fast                                          |
| text.welcome        | JSON Text   | Minecraft JSON Text for welcome message                                                           |
| text.queueNumber    | string      | Format string to notify queue number                                                              |
| text.enteringGame   | string      | Text which tells player they are entering game                                                    |
| soundNotify.since   | int         | Notify player with a sound effect on queue number changes when reach this number                  |
| soundNotify.sound   | string      | Minecraft sound effect name ([Refer Here](https://pokechu22.github.io/Burger/1.14.4.html#sounds)) |

## Special Thanks
### References
1. [BungeeCord Wiki](https://www.spigotmc.org/wiki/bungeecord/)
2. [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)
### Tester (Minecraft ID)
```MzDTin``` ```Shuang2716``` ```Oo_Kuma_oO``` ```otakuyuanji``` ```mack68426```
```Ikaros2333``` ```ohanndark``` ```niwadaisuke``` ```Foiluk``` ```Emerald98787```
```Night_star_0u0``` ```KissMy_Ass``` ```anyabanana``` ```laki0802``` ```SideMan_is_me```
```shenching3615```

## Alternatives
1. [MastuQueueBungee](https://github.com/EmotionalLove/MatsuQueueBungee)

## Plugin development
I am too lazy to write documentation for this part.

我很懶，插件開發的文檔就不寫了。