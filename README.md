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
node index.js
```
### With PM2
```bash
git clone --branch stable https://github.com/eslym/bungee-queue.git
cd bungee-queue
npm install
pm2 start index.js --name bungee-queue
pm2 save
```