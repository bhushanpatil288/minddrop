
import app from './app.js';
import { env } from './config/env.js';
import {
    initializeDatabase,
    closeDatabase,
} from './database/connection.js';

async function startServer() {
    try {
        await initializeDatabase();

        const server = app.listen(env.PORT, () => {
            console.log(`MindDrop API: http://localhost:${env.PORT}/`);
        });

        function shutdown() {
            console.log('Shutting down MindDrop...');

            server.close(() => {
                closeDatabase();
                process.exit(0);
            });
        }

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

startServer();
