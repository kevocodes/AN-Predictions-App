import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LinearRegressionLab from "@/components/linear-regression-lab"
import LogisticRegressionLab from "@/components/logistic-regression-lab"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Proyecto 1 - Equipo Converge a 10</h1>

      <Tabs defaultValue="linear" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="linear">
            <p className="hidden sm:block">Regresión Lineal</p>
            <p className="block sm:hidden">Reg. Lineal</p>
          </TabsTrigger>
          <TabsTrigger value="logistic">
            <p className="hidden sm:block">Regresión Logística</p>
            <p className="block sm:hidden">Reg. Logística</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linear">
          <LinearRegressionLab />
        </TabsContent>

        <TabsContent value="logistic">
          <LogisticRegressionLab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
