/**
 * server.js
 * Entry point for Lunaris WebSocket server
 * 
 * LUNARIS_TODO: add HTTP server for hosting later
 */

const { LunarisWebSocketServer } = require('./websocketServer.js');

// Server configuration
const CONFIG = {
    port: 8080,
    name: 'Lunaris Server',
    version: '0.1.0'
};

// Create and start server
async function startServer() {
    console.log('========================================');
    console.log(`Starting ${CONFIG.name} v${CONFIG.version}`);
    console.log('========================================');
    
    const server = new LunarisWebSocketServer(CONFIG.port);
    
    try {
        await server.startServer(CONFIG.port);
        console.log('========================================');
        console.log('Server is ready!');
        console.log(`Port: ${CONFIG.port}`);
        console.log('========================================');
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\nReceived SIGINT, shutting down gracefully...');
            server.stopServer();
            process.exit(0);
        });
        
        process.on('SIGTERM', () => {
            console.log('\nReceived SIGTERM, shutting down gracefully...');
            server.stopServer();
            process.exit(0);
        });
        
        return server;
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start server if run directly
if (require.main === module) {
    startServer();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startServer,
        CONFIG
    };
}
