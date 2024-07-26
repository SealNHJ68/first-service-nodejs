const express = require('express');
const base64url = require('base64-url');  // Importa el módulo base64-url
const app = express();
const port = 3000;

// Ruta para manejar solicitudes GET con parámetros de consulta codificados en Base64: nombre y apellido
app.get('/saludo', (req, res) => {
  const nombreBase64 = req.query.nombre;
  const apellidoBase64 = req.query.apellido;

  if (nombreBase64 && apellidoBase64) {
    // Decodifica los parámetros de Base64
    const nombre = base64url.decode(nombreBase64);
    const apellido = base64url.decode(apellidoBase64);
    res.send(`¡Hola, ${nombre} ${apellido}!`);
  } else {
    res.send('Por favor, proporciona ambos parámetros "nombre" y "apellido" codificados en Base64.');
  }
});

app.listen(port, () => {
  console.log(`Microservicio escuchando en http://localhost:${port}`);
});
