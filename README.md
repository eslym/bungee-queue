# Bungee Queue
A 2B2T-Like Queue System.

一个仿 2B2T 的排隊系統。

## Notice
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
### With PM2
```bash
git clone --branch stable https://github.com/eslym/bungee-queue.git
cd bungee-queue
npm install
cp settings.json.example settings.json
pm2 start index.js --name bungee-queue
pm2 save
```

## Configuration
| Path              | Type        | Description                                    |
|-------------------|-------------|------------------------------------------------|
| host              | string (ip) | Ip which queue server listening to             |
| port              | int         | Port number which queue server listening to    |
| version           | string      | Minecraft Version                              |
| targetServer      | string      | Target server in bungeecord                    |
| maxInQueue        | int         | Max player allowed in queue                    |
| maxPlayers        | int         | Max player allowed in target server            |
| queueChat         | boolean     | Enable chat in queue server                    |
| text.welcome      | JSON Text   | Minecraft JSON Text for welcome message        |
| text.queueNumber  | string      | Format string to notify queue number           |
| text.enteringGame | string      | Text which tells player they are entering game |

## Special Thanks
### Tester (Minecraft ID)
MzDTin, Shuang2716, Oo_Kuma_oO, otakuyuanji, mack68426, Ikaros2333
