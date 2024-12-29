# Usa la imagen oficial de Node.js con una versión más reciente
FROM node:18

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias para instalar las dependencias primero
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el resto de la aplicación
COPY . .

# Expone el puerto por el que el servidor Vite corre (5173 por defecto)
EXPOSE 5173

# Comando para iniciar el servidor de desarrollo Vite
CMD ["npm", "start"]
