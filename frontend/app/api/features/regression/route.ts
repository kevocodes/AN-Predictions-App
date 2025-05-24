import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Llamar a la API externa para obtener las características
    const response = await fetch(`${process.env.API_BASE_URL || "http://localhost:8000"}/predict/regression/features`)

    if (!response.ok) {
      throw new Error("Error al obtener las características")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener las características:", error)
    return NextResponse.json({ error: "Error al obtener las características" }, { status: 500 })
  }
}
