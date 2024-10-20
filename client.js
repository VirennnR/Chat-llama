import { io } from 'socket.io-client';
import readline from 'readline';
import * as dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const PORT = process.env.PORT;

const socket = io(`http://localhost:${PORT}`);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


function promptUser() {
    rl.question(chalk.bold.underline('You:'), (message) => {
        if (message.toLowerCase() === 'exit' || ' exit') {
            console.log('Exiting chat...');
            rl.close();
            socket.disconnect();
            process.exit(0);
        }

        socket.emit('chatMessage', message);

        process.stdout.write(chalk.bold.underline('Llama:'));
    });
}

socket.on('botResponse', (response) => {

    console.log("  "+response);
    console.log(''); 
    promptUser(); 
});

socket.on('connect', () => {
    console.log('Connected to the server.');

    const predefinedMessage = '  Hello, Llama! How are you today?';
    console.log(chalk.bold.underline('You:') + predefinedMessage);
    socket.emit('chatMessage', predefinedMessage); 

    process.stdout.write(chalk.bold.underline('Llama:'));
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
    process.exit(0);
});

