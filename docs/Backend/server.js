const app = require('./src/app');
const connectDB = require('./src/config/database');
require ('dotenv').config();

const PORT = process.env.PORT || 3000; 

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Inicialização falhou', error.message);
        process.exit(1)
    };
};

startServer();
