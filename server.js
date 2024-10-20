import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import path from 'path';
import { getLlama, LlamaChatSession } from 'node-llama-cpp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Load the Llama model
const llama = await getLlama();
const model = await llama.loadModel({
    modelPath: path.join(__dirname, 'models', 'notus-7b-v1.Q4_K_M.gguf'),
});
const context = await model.createContext();
const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
});

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`); 
    console.log('Conversation is going on'); 

    socket.on('chatMessage', async (message) => {

        const response = await session.prompt(message);
        socket.emit('botResponse', response);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
