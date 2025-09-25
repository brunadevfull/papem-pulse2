import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, AlertTriangle, Target, Award, Building2, MessageSquare, FileText, Download } from "lucide-react";
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
  const [isExporting, setIsExporting] = useState(false);

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const htmlContent = await response.text();
      
      // Criar blob com o HTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_Clima_Organizacional_PAPEM_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdfReport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const htmlContent = await response.text();
      
      // Criar blob com o HTML
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_Clima_Organizacional_PAPEM_com_Graficos_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Mostrar instruções para o usuário
      alert('📊 Relatório com gráficos baixado!\n\n📋 Como converter para PDF:\n1. Abra o arquivo baixado no seu navegador\n2. Pressione Ctrl+P (Cmd+P no Mac)\n3. Selecione "Salvar como PDF"\n4. Configure margens como "Mínimas"\n5. Ative "Gráficos de fundo"\n\nO arquivo HTML está pronto para conversão profissional!');
      
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Análise dos resultados da pesquisa de clima organizacional</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleExportReport}
              disabled={isExporting}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Gerando HTML...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Exportar HTML
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleExportPdfReport}
              disabled={isExporting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-6 py-3"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando PDF...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <Download className="w-4 h-4" />
                  PDF com Gráficos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

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