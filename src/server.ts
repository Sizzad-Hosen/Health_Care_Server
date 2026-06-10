import { Server } from 'http';
import app from './app';
import config from './app/config';
import prisma from './shared/prisma';

let server: Server;
let isShuttingDown = false;

const shutdown = async (signal: string, exitCode = 0) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.info(`${signal} received. Shutting down gracefully...`);

    if (server) {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    await prisma.$disconnect();
    console.info("Server closed!");
    process.exit(exitCode);
};

async function main() {
    server = app.listen(config.port, () => {
        console.log("Server is running on port ", config.port);
    });

    process.on('SIGTERM', () => {
        void shutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
        void shutdown('SIGINT');
    });

    process.on('uncaughtException', (error) => {
        console.error(error);
        void shutdown('uncaughtException', 1);
    });

    process.on('unhandledRejection', (error) => {
        console.error(error);
        void shutdown('unhandledRejection', 1);
    });
};

main().catch((error) => {
    console.error(error);
    void prisma.$disconnect().finally(() => process.exit(1));
});
