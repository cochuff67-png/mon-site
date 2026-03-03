const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const players = {};
const walls = [
    { x: 50, y: 150, width: 20, height: 200 },
    { x: 430, y: 150, width: 20, height: 200 },
    { x: 150, y: 100, width: 200, height: 20 }
];

io.on('connection', (socket) => {
    // On attend que le joueur envoie son pseudo pour le créer
    socket.on('joinGame', (username) => {
        players[socket.id] = {
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            name: username || "Invité"
        };
        socket.emit('init', { players, walls });
        io.emit('updatePlayers', players);
    });

    socket.on('move', (data) => {
        const p = players[socket.id];
        if (p) {
            p.x += data.x;
            p.y += data.y;
            // Limites de la carte
            p.x = Math.max(0, Math.min(580, p.x));
            p.y = Math.max(0, Math.min(580, p.y));
            io.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

server.listen(3000, '0.0.0.0', () => console.log('Jeu lancé sur le port 3000'));