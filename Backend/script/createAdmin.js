const mongoose = require('mongoose');
const   User   = require('../models/User');

async function createAdmin () {
  try {

    if (!process.env.MONGODB_URI) 

      { throw new Error('MONGODB_URI não configurada'); }

    if (
      !process.env.ADMIN_NAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) 
      
      {throw new Error('Variáveis ADMIN não configuradas');}

    await mongoose.connect(process.env.MONGODB_URI);
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) { console.log('  Admin já existe:');
      return
    }

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isVerified: true,
    });

    console.log(`Admin criado: ${process.env.ADMIN_EMAIL}`);
    }
    catch (err) {
      console.error('Erro ao criar admin:', err.message);
    }
    finally{
      if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
   }
  }
};

createAdmin();