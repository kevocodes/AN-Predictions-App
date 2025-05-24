# Etapa 1: Instalar dependencias y construir la app
FROM node:22-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Etapa 2: Imagen liviana para producción
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar solo los archivos necesarios desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


# Exponer el puerto por defecto
EXPOSE 3000

# Comando de arranque
CMD ["npm", "run", "start"]
