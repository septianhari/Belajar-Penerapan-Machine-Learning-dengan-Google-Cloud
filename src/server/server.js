require('dotenv').config(); // Pastikan dotenv dimuat untuk memuat variabel lingkungan
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'], // Membuka akses ke semua domain
            },
        },
    });

    try {
        // Memuat model machine learning dan menyimpannya di aplikasi server
        const model = await loadModel();
        server.app.model = model;
    } catch (error) {
        console.error('Error loading model:', error.message);
        process.exit(1); // Keluar dari aplikasi jika model gagal dimuat
    }

    server.route(routes);

    // Menangani respon error pada server
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    try {
        // Memulai server
        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1); // Keluar dari aplikasi jika server gagal dimulai
    }
})();
