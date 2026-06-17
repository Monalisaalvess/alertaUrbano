const app = require('./src/app');
const connectDB = require('./src/config/database');
require('dotenv').config();

console.log('Iniciando servidor...'); // adiciona isso
console.log('PORT:', process.env.PORT);   // e isso
console.log('MONGO_URI:', process.env.MONGO_URI ? 'EXISTE' : 'UNDEFINED'); // e isso

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log('Conectando ao banco...'); // e isso
        await connectDB();
        console.log('Banco conectado!'); // e isso
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Inicialização falhou:', error.message);
        process.exit(1);
    }
};

startServer();