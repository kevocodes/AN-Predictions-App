
# 🧠 Proyecto 1 - Sistema de Predicción de Consumo y Clasificación de Actividades

Este proyecto presenta una aplicación web interactiva que permite realizar predicciones mediante dos modelos de machine learning entrenados en Python:

- **Regresión Lineal Múltiple** para predecir el consumo energético en Wh.
- **Regresión Logística Multiclase** para clasificar actividades humanas.

Ambos modelos fueron implementados, entrenados y validados en un entorno JupyterLab dockerizado. Luego se expusieron como API REST usando **FastAPI** y fueron consumidos desde una aplicación frontend construida en **Next.js**.

---

## 📊 Características de la Aplicación

### 🔹 Regresión Lineal - Predicción de Consumo Energético

- **Predicción Individual**: Permite ingresar manualmente los valores de las variables predictoras (temperaturas y humedades en diferentes zonas del edificio, además de la hora) para obtener el consumo estimado.
- **Predicción por Lotes**: El usuario puede descargar una plantilla en Excel, llenarla con múltiples instancias, y cargarla en la app para obtener predicciones masivas.

### 🔸 Regresión Logística - Clasificación de Actividades Humanas

- **Predicción Individual**: Permite ingresar características derivadas de sensores de movimiento y aceleración para predecir la actividad (como caminar, acostado, subir escaleras, etc.).
- **Predicción por Lotes**: Igual que en la regresión, se descarga una plantilla Excel, se completan los datos y se obtienen predicciones en lote, con probabilidad asociada.

---

## ⚙️ Componentes Técnicos

### 📁 Backend - FastAPI

El backend ofrece los siguientes endpoints:

- `POST /predict/regression` – Predicción individual de consumo energético.
- `GET /predict/regression/features` – Lista de features esperadas para el modelo de regresión.
- `POST /predict/regression/batch` – Predicciones por lote a partir de archivo Excel.
- `POST /predict/classification` – Predicción individual de actividad humana.
- `GET /predict/classification/features` – Lista de features esperadas para el modelo de clasificación.
- `POST /predict/classification/batch` – Predicciones por lote de actividades a partir de archivo Excel.

### 🖼️ Frontend - Next.js

- Interfaz intuitiva para ingreso de datos y resultados en tiempo real.
- Carga de archivos Excel para procesamiento por lotes.
- Visualización de resultados de las predicciones.

---

## 🐳 Guía de Ejecución con Docker Compose

### 🛠️ Prerrequisitos

- Tener Docker y Docker Compose instalados.

### ▶️ Instrucciones

Desde la raíz del proyecto (donde está el archivo `docker-compose.yml`), ejecuta:

```bash
docker compose up --build
```

Esto:

- Construye las imágenes para el frontend y backend.
- Lanza ambos contenedores y los conecta a través de una red virtual (`app-network`).
- Expone los servicios en:
  - `http://localhost:3000` (Frontend - Next.js)
  - `http://localhost:8000/docs` (Backend - Documentación interactiva de FastAPI)

### 🔁 Variables de Entorno

El frontend se comunica con el backend mediante la variable:

```env
API_BASE_URL=http://backend:8000
```

Esta configuración está predefinida en `docker-compose.yml`.

---

## 📁 Estructura del Proyecto

```
predictions-app/
├── backend/                # API REST con FastAPI
├── frontend/               # Interfaz con Next.js
├── docker-compose.yml      # Orquestación de servicios
└── proyecto-01.ipynb       # Notebook con desarrollo y entrenamiento de modelos
```

---

## 📄 Licencia

MIT License – Consulta el archivo [LICENSE](./LICENSE) para más información.