import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// Definición de las columnas para regresión lineal
const LINEAR_FEATURES = ["T1", "T2", "T6", "RH_6", "T8", "RH_8", "RH_9", "T_out", "RH_out", "hour"]

// Esta función simula una llamada a tu modelo de regresión lineal
// Reemplázala con la llamada real a tu API de predicción
async function predictLinearRegression(features: number[]): Promise<number> {
  // Simulación simple para demostración
  return (features.reduce((sum, val) => sum + val, 0) / features.length) * 1.5
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
        const features = LINEAR_FEATURES.map((feature) => (typeof row[feature] === "number" ? row[feature] : 0))

        // Hacer la predicción
        const prediction = await predictLinearRegression(features)

        // Devolver el resultado con los datos de entrada
        return {
          input: LINEAR_FEATURES.reduce(
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
