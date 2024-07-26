# Usa una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente de la aplicación
COPY . .

# Expone el puerto en el que correrá el microservicio
EXPOSE 3000

# Define el comando que se ejecutará al iniciar el contenedor
CMD ["npm", "start"]
