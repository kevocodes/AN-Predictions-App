import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Crear un nuevo FormData para enviar a la API externa
    const apiFormData = new FormData()
    apiFormData.append("file", file)

    // Llamar a la API externa para hacer la predicción por lotes
    const response = await fetch(
      `${process.env.API_BASE_URL || "http://localhost:8000"}/predict/classification/batch`,
      {
        method: "POST",
        body: apiFormData,
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || errorData.error || "Error en la predicción por lotes")
    }

    // Obtener los resultados de la API
    const result = await response.json()

    // Procesar los resultados para combinar predictions con inputs
    if (
      result.predictions &&
      result.inputs &&
      Array.isArray(result.predictions) &&
      Array.isArray(result.inputs) &&
      result.predictions.length === result.inputs.length
    ) {
      // Combinar cada predicción con su correspondiente input
      const combinedResults = result.predictions.map((prediction: any, index: number) => ({
        ...prediction,
        input: result.inputs[index],
      }))

      return NextResponse.json({ predictions: combinedResults })
    }

    // Si no hay estructura esperada, devolver los resultados tal cual
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en el procesamiento por lotes:", error)
    return NextResponse.json({ error: "Error al procesar el archivo" }, { status: 500 })
  }
}
