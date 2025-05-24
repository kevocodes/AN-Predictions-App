"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Eye, Trash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUpload from "@/components/file-upload";
import { LOGISTIC_FEATURES } from "@/constants/features";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTooltip } from "./custom-tooltip";

export default function LogisticRegressionLab() {
  const [formData, setFormData] = useState<Record<string, number>>({});
  const [prediction, setPrediction] = useState<{
    activity: string;
    probability: number;
  } | null>(null);
  const [batchResults, setBatchResults] = useState<Array<{
    id: string | number;
    activity: string;
    probability: number;
    input?: Record<string, number>;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer solo los nombres de las características para mantener el orden
  const featureNames = LOGISTIC_FEATURES.map((feature) => feature.name);

  const handleInputChange = (feature: string, value: string) => {
    setFormData({
      ...formData,
      [feature]: Number.parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Asegurarse de que los datos están en el orden correcto
      const orderedData = featureNames.map((feature) => formData[feature] || 0);

      // Llamar a la API para hacer la predicción
      const response = await fetch("/api/predict/classification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: orderedData }),
      });

      if (!response.ok) {
        throw new Error("Error al realizar la predicción");
      }

      const result = await response.json();
      setPrediction(result);
      setFormData({}); // Limpiar el formulario después de la predicción
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/predict/classification/batch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar el archivo");
      }

      const results = await response.json();
      console.log("Batch results:", results); // Para depuración

      setBatchResults(results.predictions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar el archivo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/templates/logistic");
      if (!response.ok) {
        throw new Error("Error al descargar la plantilla");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla_regresion_logistica.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al descargar la plantilla"
      );
    }
  };

  // Función para ordenar las entradas según el orden definido en featureNames
  const getOrderedInputEntries = (
    input: Record<string, number> | undefined
  ) => {
    if (!input) return [];

    // Crear un array de entradas ordenadas según featureNames
    return featureNames
      .filter((name) => name in input)
      .map((name) => [name, input[name]])
      .concat(
        // Añadir cualquier entrada adicional que no esté en featureNames al final
        Object.entries(input).filter(([key]) => !featureNames.includes(key))
      );
  };

  const handleClearResults = () => {
    setBatchResults(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Modelo de Clasificación</CardTitle>
        <CardDescription>
          Evalúa el modelo de regresión logística para clasificar actividades
          humanas. Puedes probar el modelo con datos individuales o cargando un
          archivo Excel con múltiples registros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="individual">
              <p className="hidden sm:block">Predicción Individual</p>
              <p className="sm:hidden block">Individual</p>
            </TabsTrigger>
            <TabsTrigger value="batch">
              <p className="hidden sm:block">Predicción por Lotes</p>
              <p className="sm:hidden block">Por Lotes</p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LOGISTIC_FEATURES.map((feature) => (
                  <div key={feature.name} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={feature.name}>{feature.name}</Label>
                      <CustomTooltip description={feature.description} />
                    </div>
                    <Input
                      id={feature.name}
                      type="number"
                      step="any"
                      placeholder="0"
                      onChange={(e) =>
                        handleInputChange(feature.name, e.target.value)
                      }
                      value={formData[feature.name] ?? ""}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Procesando..." : "Predecir"}
              </Button>
            </form>

            {prediction !== null && (
              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">
                  Resultado de la predicción:
                </h3>
                <div className="flex flex-col space-y-2">
                  <p>
                    <span className="font-medium">Actividad:</span>{" "}
                    {prediction.activity}
                  </p>
                  <p>
                    <span className="font-medium">Probabilidad:</span>{" "}
                    {(prediction.probability * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="batch">
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Plantilla
                </Button>

                <FileUpload
                  onFileUpload={handleFileUpload}
                  acceptedFileTypes=".xlsx"
                  isLoading={isLoading}
                />
              </div>

              {batchResults && batchResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium mb-4">Resultados:</h3>
                    <Button
                      variant="outline"
                      className="mb-4"
                      onClick={handleClearResults}
                    >
                      <Trash className="h-4 w-4" />
                      <p className="hidden sm:block">Limpiar Resultados</p>
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actividad
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Probabilidad
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Detalles
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {batchResults.map((result, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {result.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              {result.activity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              {(result.probability * 100).toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Ver datos
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Detalles de la predicción #{result.id}
                                    </DialogTitle>
                                  </DialogHeader>

                                  <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-2">
                                      Valores de entrada:
                                    </h3>
                                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-80">
                                      <table className="w-full">
                                        <tbody>
                                          {getOrderedInputEntries(
                                            result.input
                                          ).map(([key, value]) => (
                                            <tr
                                              key={key as string}
                                              className="border-b border-border/40 last:border-0"
                                            >
                                              <td className="py-2 pr-4 font-medium">
                                                {key}:
                                              </td>
                                              <td className="py-2 text-right">
                                                {value}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">
                                          Actividad:
                                        </span>
                                        <span className="font-bold text-lg">
                                          {result.activity}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                          Probabilidad:
                                        </span>
                                        <span className="font-bold text-lg">
                                          {(result.probability * 100).toFixed(
                                            2
                                          )}
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
