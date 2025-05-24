# Usa una imagen oficial de Python como base
FROM python:3.12-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Expone el puerto (ajústalo si es diferente)
EXPOSE 8000

# Comando para correr la app (ajusta el módulo según tu estructura)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
