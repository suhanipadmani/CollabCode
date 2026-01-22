import dotenv from "dotenv";
import { createServer } from 'node:http';
import express from 'express';
import { Server } from "socket.io";
import { ACTIONS } from "./actions.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
const PORT = process.env.PORT;

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on("connect", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({roomId, username}) => {
    userSocketMap[socket.id]= username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({socketId}) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      })
    });
    delete userSocketMap[socket.id];
    socket.leave();
  })

});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});