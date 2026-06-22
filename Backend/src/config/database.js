const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Erro('Mongo_URI não cconfigurada');
    }
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect
    (process.env.MONGO_URI, {serverSelectionTimeoutMS:500,});

        console.log(`MongoDB conectado: ${conn.connection.host}`);
  } 
  catch (error) {
        console.error('Erro ao conectar MongoDB',error.message);
    
        process.exit(1);
  }
};

module.exports = connectDB;