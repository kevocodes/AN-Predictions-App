import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// Definición de las columnas para regresión logística
const LOGISTIC_FEATURES = [
  "tBodyAcc-max()-X",
  "tGravityAcc-mean()-X",
  "tGravityAcc-max()-X",
  "tGravityAcc-min()-X",
  "tGravityAcc-energy()-X",
  "tBodyAccJerk-entropy()-X",
  "tBodyAccJerk-entropy()-Y",
  "tBodyAccJerk-entropy()-Z",
  "tBodyAccJerkMag-entropy()",
  "fBodyAcc-entropy()-X",
  "fBodyAccJerk-entropy()-X",
  "fBodyAccJerk-entropy()-Y",
  "fBodyAccJerk-entropy()-Z",
  "fBodyBodyAccJerkMag-entropy()",
  "angle(X,gravityMean)",
]

// Esta función simula una llamada a tu modelo de regresión logística
// Reemplázala con la llamada real a tu API de predicción
async function predictLogisticRegression(features: number[]): Promise<{ class: number; probability: number }> {
  // Simulación simple para demostración
  const sum = features.reduce((sum, val) => sum + val, 0)
  const probability = 1 / (1 + Math.exp(-sum / 100))
  return {
    class: probability > 0.5 ? 1 : 0,
    probability,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Leer el archivo Excel
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    // Procesar cada fila y hacer predicciones
    const predictions = await Promise.all(
      jsonData.map(async (row: any) => {
        // Extraer características en el orden correcto
        const features = LOGISTIC_FEATURES.map((feature) => (typeof row[feature] === "number" ? row[feature] : 0))

        // Hacer la predicción
        const prediction = await predictLogisticRegression(features)

        // Devolver el resultado con los datos de entrada
        return {
          input: LOGISTIC_FEATURES.reduce(
            (obj, feature, index) => {
              obj[feature] = features[index]
              return obj
            },
            {} as Record<string, number>,
          ),
          prediction,
        }
      }),
    )

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error("Error en el procesamiento por lotes:", error)
    return NextResponse.json({ error: "Error al procesar el archivo" }, { status: 500 })
  }
}
