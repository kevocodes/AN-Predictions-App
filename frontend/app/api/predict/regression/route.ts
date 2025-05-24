import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.features || !Array.isArray(body.features)) {
      return NextResponse.json({ error: "Se requiere un array de características" }, { status: 400 })
    }

    // Llamar a la API externa para hacer la predicción
    const response = await fetch(`${process.env.API_BASE_URL || "http://localhost:8000"}/predict/regression`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features: body.features }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error en la predicción")
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en la predicción:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
