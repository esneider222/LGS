const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('your-mongodb-connection-string')) {
    throw new Error('Configura una URI real en lgs-backend/.env.');
  }
  if (!uri.startsWith('mongodb+srv://')) {
    throw new Error('La URI configurada no tiene el formato mongodb+srv de Atlas.');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  await mongoose.connection.db.admin().command({ ping: 1 });

  const collections = await mongoose.connection.db
    .listCollections({}, { nameOnly: true })
    .toArray();
  const names = collections.map((collection) => collection.name);

  console.log(`Conexión a MongoDB Atlas correcta. Base: ${mongoose.connection.name}`);
  if (names.length) {
    console.log(`Colecciones: ${names.join(', ')}`);
  } else {
    console.log('La base aún no tiene colecciones; inicia la API para inicializar los modelos.');
  }
}

checkDatabase()
  .catch((err) => {
    console.error(`No se pudo verificar MongoDB Atlas: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
