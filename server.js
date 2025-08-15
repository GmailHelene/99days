// Enkel Socket.IO multiplayer-server for Railway
const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  path: "/api/socketio"
});

// --- Multiplayer logikk ---
const lobbies = new Map();
const activeGames = new Map();
const playerSessions = new Map();

io.on("connection", (socket) => {
  const playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  playerSessions.set(playerId, { socket, playerId, currentGame: null, currentLobby: null });
  console.log(`Player ${playerId} connected`);
  socket.emit('connection_established', { playerId, timestamp: Date.now() });

  socket.on('create_lobby', (config) => {
    const lobbyId = 'lobby_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const lobby = {
      id: lobbyId,
      hostPlayerId: playerId,
      players: new Map(),
      config: {
        maxPlayers: config.maxPlayers || 4,
        worldType: config.worldType || 'forest',
        gameMode: config.gameMode || 'cooperative',
        isPrivate: config.isPrivate || false
      },
      status: 'waiting',
      createdAt: Date.now()
    };
    lobby.players.set(playerId, { id: playerId, name: config.playerName || 'Host', isHost: true, isReady: false });
    lobbies.set(lobbyId, lobby);
    const session = playerSessions.get(playerId);
    if (session) session.currentLobby = lobbyId;
    socket.emit('lobby_created', { lobby: { ...lobby, players: Array.from(lobby.players.values()) } });
  });

  socket.on('join_lobby', ({ lobbyId, playerName }) => {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return socket.emit('error', { error: 'Lobby not found' });
    if (lobby.players.size >= lobby.config.maxPlayers) return socket.emit('error', { error: 'Lobby is full' });
    if (lobby.status !== 'waiting') return socket.emit('error', { error: 'Game already started' });
    lobby.players.set(playerId, { id: playerId, name: playerName || `Player ${lobby.players.size + 1}`, isHost: false, isReady: false });
    const session = playerSessions.get(playerId);
    if (session) session.currentLobby = lobbyId;
    socket.emit('lobby_joined', { lobby: { ...lobby, players: Array.from(lobby.players.values()) } });
    socket.to(`lobby_${lobbyId}`).emit('player_joined', { player: lobby.players.get(playerId) });
    socket.join(`lobby_${lobbyId}`);
  });

  socket.on('leave_lobby', () => {
    const session = playerSessions.get(playerId);
    if (session?.currentLobby) {
      const lobbyId = session.currentLobby;
      const lobby = lobbies.get(lobbyId);
      if (lobby) {
        lobby.players.delete(playerId);
        if (lobby.players.size === 0) lobbies.delete(lobbyId);
        else {
          const remainingPlayers = Array.from(lobby.players.values());
          if (!remainingPlayers.find(p => p.isHost)) {
            remainingPlayers[0].isHost = true;
            lobby.hostPlayerId = remainingPlayers[0].id;
          }
        }
        socket.leave(`lobby_${lobbyId}`);
        socket.to(`lobby_${lobbyId}`).emit('player_left', { playerId });
      }
      session.currentLobby = null;
    }
  });

  socket.on('ready_toggle', () => {
    const session = playerSessions.get(playerId);
    if (session?.currentLobby) {
      const lobby = lobbies.get(session.currentLobby);
      if (lobby?.players.has(playerId)) {
        const player = lobby.players.get(playerId);
        player.isReady = !player.isReady;
        io.to(`lobby_${session.currentLobby}`).emit('player_ready_changed', { playerId, isReady: player.isReady });
      }
    }
  });

  socket.on('start_game', () => {
    const session = playerSessions.get(playerId);
    if (session?.currentLobby) {
      const lobby = lobbies.get(session.currentLobby);
      if (!lobby || lobby.hostPlayerId !== playerId) return socket.emit('error', { error: 'Not authorized or lobby not found' });
      const allReady = Array.from(lobby.players.values()).every(p => p.isReady);
      if (!allReady) return socket.emit('error', { error: 'Not all players are ready' });
      lobby.status = 'starting';
      const gameId = 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const game = {
        gameId,
        hostPlayerId: playerId,
        players: new Map(),
        gameState: {
          worldType: lobby.config.worldType,
          currentDay: 1,
          gameTime: 0,
          resources: new Map(),
          buildings: new Map(),
          events: []
        },
        maxPlayers: lobby.config.maxPlayers,
        isActive: true,
        lastUpdate: Date.now()
      };
      for (const [pid, pdata] of lobby.players) {
        game.players.set(pid, { id: pid, name: pdata.name, position: { x: 1500 + (Math.random() - 0.5) * 200, y: 1500 + (Math.random() - 0.5) * 200 }, health: 100, hunger: 100, thirst: 100, energy: 100, warmth: 100, level: 1, inventory: new Map(), isActive: true, lastSeen: Date.now() });
      }
      activeGames.set(gameId, game);
      lobby.status = 'in_game';
      lobby.gameId = gameId;
      session.currentGame = gameId;
      socket.join(`game_${gameId}`);
      io.to(`lobby_${session.currentLobby}`).emit('game_starting', { gameId, gameState: getGameState(game) });
    }
  });

  socket.on('game_update', (data) => {
    const session = playerSessions.get(playerId);
    if (session?.currentGame) {
      const game = activeGames.get(session.currentGame);
      if (game) {
        game.players.get(playerId).position = data.playerData.position;
        game.players.get(playerId).health = data.playerData.health;
        game.players.get(playerId).hunger = data.playerData.hunger;
        game.players.get(playerId).thirst = data.playerData.thirst;
        game.players.get(playerId).energy = data.playerData.energy;
        game.players.get(playerId).warmth = data.playerData.warmth;
        game.players.get(playerId).level = data.playerData.level;
        socket.to(`game_${session.currentGame}`).emit('player_update', { playerId, playerData: data.playerData });
      }
    }
  });

  socket.on('resource_collected', (data) => {
    const session = playerSessions.get(playerId);
    if (session?.currentGame) {
      io.to(`game_${session.currentGame}`).emit('resource_collected', { playerId, resource: data.resource, position: data.position, timestamp: Date.now() });
    }
  });

  socket.on('chat_message', (data) => {
    const session = playerSessions.get(playerId);
    const message = { playerId, playerName: data.playerName, message: data.message, timestamp: Date.now() };
    if (session?.currentGame) io.to(`game_${session.currentGame}`).emit('chat_message', message);
    else if (session?.currentLobby) io.to(`lobby_${session.currentLobby}`).emit('chat_message', message);
  });

  socket.on('get_public_lobbies', () => {
    socket.emit('public_lobbies', { lobbies: getPublicLobbies() });
  });

  socket.on('disconnect', () => {
    const session = playerSessions.get(playerId);
    if (!session) return;
    console.log(`Player ${playerId} disconnected`);
    if (session.currentLobby) {
      const lobby = lobbies.get(session.currentLobby);
      if (lobby) {
        lobby.players.delete(playerId);
        io.to(`lobby_${session.currentLobby}`).emit('player_left', { playerId });
        if (lobby.players.size === 0) lobbies.delete(session.currentLobby);
      }
    }
    if (session.currentGame) {
      const game = activeGames.get(session.currentGame);
      if (game) {
        game.players.delete(playerId);
        io.to(`game_${session.currentGame}`).emit('player_disconnected', { playerId });
        if (game.players.size === 0) activeGames.delete(session.currentGame);
      }
    }
    playerSessions.delete(playerId);
  });
});

function getGameState(game) {
  return {
    gameId: game.gameId,
    players: Array.from(game.players.values()),
    gameState: game.gameState,
    lastUpdate: game.lastUpdate
  };
}

function getPublicLobbies() {
  const publicLobbies = [];
  for (const lobby of lobbies.values()) {
    if (!lobby.config.isPrivate && lobby.status === 'waiting') {
      publicLobbies.push({
        id: lobby.id,
        hostName: lobby.players.get(lobby.hostPlayerId)?.name || 'Unknown',
        playerCount: lobby.players.size,
        maxPlayers: lobby.config.maxPlayers,
        worldType: lobby.config.worldType,
        gameMode: lobby.config.gameMode
      });
    }
  }
  return publicLobbies;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
