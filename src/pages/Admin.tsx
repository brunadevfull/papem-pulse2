import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, TrendingUp, AlertTriangle, Target, Award, Building2, MessageSquare } from "lucide-react";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { EnvironmentCharts } from "@/components/admin/EnvironmentCharts";
import { RelationshipCharts } from "@/components/admin/RelationshipCharts";
import { MotivationCharts } from "@/components/admin/MotivationCharts";
import { DetailedAnalysis } from "@/components/admin/DetailedAnalysis";
import { OpenAnswersSection } from "@/components/admin/OpenAnswersSection";
import { RealTimeStats } from "@/components/admin/RealTimeStats";
import { AdminAuth } from "@/components/admin/AdminAuth";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }
  return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Análise dos resultados da pesquisa de clima organizacional</p>
          </div>
        </div>

        {/* Real-time Statistics */}
        <RealTimeStats />

        {/* Main Analysis */}
        <Card className="shadow-custom-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Análise Detalhada por Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="environment" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="environment" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Ambiente
                </TabsTrigger>
                <TabsTrigger value="relationship" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Relacionamento
                </TabsTrigger>
                <TabsTrigger value="motivation" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Motivação
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comentários
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Análise Detalhada
                </TabsTrigger>
              </TabsList>

              <TabsContent value="environment">
                <EnvironmentCharts />
              </TabsContent>

              <TabsContent value="relationship">
                <RelationshipCharts />
              </TabsContent>

              <TabsContent value="motivation">
                <MotivationCharts />
              </TabsContent>

              <TabsContent value="comments">
                <OpenAnswersSection />
              </TabsContent>

              <TabsContent value="analysis">
                <DetailedAnalysis />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
  );
}