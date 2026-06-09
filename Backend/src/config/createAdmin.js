
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' MongoDB conectado');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('  Admin já existe:', existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@cidadeviva.com',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin criado:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Erro:', err.message);
    process.exit(1);
  }
};

createAdmin();


/*
token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMGNhNGIyN2M3ZjFiZTdmZTIxYWNkYyIsImlhdCI6MTc3OTIxMzg4NywiZXhwIjoxNzc5ODE4Njg3fQ.Ha5U81VE_-oBmTjOzBvnKryw-3Qjw6PJhzB6RF-zRAQ",
  "user": {
    "id": "6a0ca4b27c7f1be7fe21acdc",
    "name": "Administrador",
    "email": "admin@cidadeviva.com",
    "role": "admin",
    "avatar": null
*/