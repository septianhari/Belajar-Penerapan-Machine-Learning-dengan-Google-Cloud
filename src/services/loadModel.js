require('dotenv').config(); // Pastikan dotenv dimuat untuk membaca variabel lingkungan

const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    // Memastikan MODEL_URL tersedia di variabel lingkungan
    const modelUrl = process.env.MODEL_URL;

    if (!modelUrl) {
        throw new Error('MODEL_URL is not defined in the environment');
    }

    // Memuat model menggunakan URL dari Google Cloud Storage
    const model = await tf.loadGraphModel(modelUrl);
    return model;
}

module.exports = loadModel;
