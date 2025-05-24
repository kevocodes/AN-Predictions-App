import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { LINEAR_FEATURES } from "@/constants/features"

export async function GET() {
  try {
    // Obtener los nombres de las características
    const featureNames = LINEAR_FEATURES.map((feature) => feature.name)

    // Crear un libro de trabajo y una hoja
    const workbook = XLSX.utils.book_new()

    // Crear datos de ejemplo con ID
    const exampleData = [
      {
        id: 1,
        ...featureNames.reduce(
          (obj, feature) => {
            obj[feature] = 0
            return obj
          },
          {} as Record<string, number>,
        ),
      },
      {
        id: 2,
        ...featureNames.reduce(
          (obj, feature) => {
            obj[feature] = 0
            return obj
          },
          {} as Record<string, number>,
        ),
      },
    ]

    // Crear una hoja con los datos de ejemplo
    const worksheet = XLSX.utils.json_to_sheet(exampleData)

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla")

    // Convertir el libro a un buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // Devolver el archivo como respuesta
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="plantilla_regresion_lineal.xlsx"',
      },
    })
  } catch (error) {
    console.error("Error al generar la plantilla:", error)
    return NextResponse.json({ error: "Error al generar la plantilla" }, { status: 500 })
  }
}
