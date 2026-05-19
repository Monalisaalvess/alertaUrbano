const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth' , require('./routes/authRoutes'))
app.use('/api/reports' , require('./routes/reportRoutes'))
app.use('/api/admin' , require('./routes/adminRoutes'))

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});


app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(err.status || 500).json({
    error: err.message    || 'Erro interno do servidor',
  });
});


module.exports = app;