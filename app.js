const express = require('express');
const base64url = require('base64-url');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// URI de MongoDB (pasada como variable de entorno)
const mongoUri = process.env.MONGO_URI;

let db;

const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = client.db();
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a MongoDB, reintentando en 5 segundos...", err);
    setTimeout(connectToMongoDB, 5000); // Reintentar la conexión en 5 segundos
  }
};

connectToMongoDB();

// Ruta para manejar solicitudes GET con parámetros de consulta codificados en Base64: nombre y apellido
// http://localhost:3000/saludo?nombre=Sm9obiBEb2U=&apellido=RG9l
app.get('/saludo', async (req, res) => {
  const nombreBase64 = req.query.nombre;
  const apellidoBase64 = req.query.apellido;

  if (nombreBase64 && apellidoBase64) {
    // Decodifica los parámetros de Base64
    const nombre = base64url.decode(nombreBase64);
    const apellido = base64url.decode(apellidoBase64);

    // Guardar la información en MongoDB
    const collection = db.collection('usuarios');
    await collection.insertOne({ nombre, apellido });

    res.send(`¡Hola, ${nombre} ${apellido}!`);
  } else {
    res.send('Por favor, proporciona ambos parámetros "nombre" y "apellido" codificados en Base64.');
  }
});

// Ruta para consultar datos
app.get('/usuarios', async (req, res) => {
  try {
    const collection = db.collection('usuarios');
    const usuarios = await collection.find({}).toArray();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al consultar los usuarios:', err);
    res.status(500).send('Error al consultar los usuarios.');
  }
});

app.listen(port, () => {
  console.log(`Microservicio escuchando en http://localhost:${port}`);
});
