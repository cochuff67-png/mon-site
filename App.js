// Taille des joueurs (ex: 20x20 pixels)
const PLAYER_SIZE = 20;

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + PLAYER_SIZE &&
        rect1.x + PLAYER_SIZE > rect2.x &&
        rect1.y < rect2.y + PLAYER_SIZE &&
        rect1.y + PLAYER_SIZE > rect2.y
    );
}

// Dans votre socket.on('move', ...)
socket.on('move', (data) => {
    if (players[socket.id]) {
        // On calcule la future position théorique
        const nextPos = {
            x: players[socket.id].x + data.x,
            y: players[socket.id].y + data.y
        };

        let collision = false;

        // On vérifie contre tous les AUTRES joueurs
        for (let id in players) {
            if (id !== socket.id) {
                if (checkCollision(nextPos, players[id])) {
                    collision = true;
                    break;
                }
            }
        }

        // Si pas de collision, on autorise le mouvement
        if (!collision) {
            players[socket.id].x = nextPos.x;
            players[socket.id].y = nextPos.y;
            io.emit('updatePlayers', players);
        }
    }
});