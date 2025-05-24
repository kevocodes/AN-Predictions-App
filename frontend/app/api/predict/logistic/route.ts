import { type NextRequest, NextResponse } from "next/server"

// Esta función simula una llamada a tu modelo de regresión logística
// Reemplázala con la llamada real a tu API de predicción
async function predictLogisticRegression(features: number[]): Promise<{ class: number; probability: number }> {
  // Simulación de predicción - reemplazar con tu lógica real
  // Por ejemplo, podrías hacer una llamada a tu API externa
  // const response = await fetch('https://tu-api-ml.com/predict/logistic', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ features })
  // });
  // return response.json();

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
    const body = await request.json()

    if (!body.features || !Array.isArray(body.features)) {
      return NextResponse.json({ error: "Se requiere un array de características" }, { status: 400 })
    }

    const prediction = await predictLogisticRegression(body.features)

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error("Error en la predicción:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
