import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, Clock, Home, Utensils, BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStats, ratingToPercentage } from "@/hooks/useStats";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#82ca9d'];

export function RealTimeStats() {
  const { stats, analytics, loading, error, refetch } = useStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">Erro ao carregar dados: {error}</div>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center p-8">Nenhum dado disponível</div>;
  }

  // Transform data for charts
  const setorChartData = stats.setorDistribution.map(item => ({
    name: item.setor,
    value: item.count
  }));

  const alojamentoChartData = stats.alojamentoDistribution.map(item => ({
    name: item.alojamento,
    count: item.count
  }));

  const ranchoChartData = stats.ranchoDistribution.map(item => ({
    name: item.rancho,
    count: item.count
  }));

  // Sample satisfaction data for key questions
  const satisfactionData = [
    {
      question: "Materiais Fornecidos",
      ...ratingToPercentage(stats.satisfactionStats.materiais_fornecidos || [])
    },
    {
      question: "Limpeza Adequada", 
      ...ratingToPercentage(stats.satisfactionStats.limpeza_adequada || [])
    },
    {
      question: "Rancho - Instalações",
      ...ratingToPercentage(stats.satisfactionStats.rancho_instalacoes || [])
    },
    {
      question: "Equipamentos Serviço",
      ...ratingToPercentage(stats.satisfactionStats.equipamentos_servico || [])
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard em Tempo Real</h2>
          <p className="text-gray-600">Dados atualizados: {new Date(stats.lastUpdated).toLocaleString('pt-BR')}</p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalResponses > 0 ? 'questionários completos' : 'Nenhuma resposta ainda'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setores Ativos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.setorDistribution.length}</div>
            <p className="text-xs text-muted-foreground">
              setores participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alojamentos</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alojamentoDistribution.length}</div>
            <p className="text-xs text-muted-foreground">
              tipos diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locais de Rancho</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ranchoDistribution.length}</div>
            <p className="text-xs text-muted-foreground">
              locais utilizados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Distribution */}
        {setorChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Distribuição por Setor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={setorChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {setorChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Alojamento Distribution */}
        {alojamentoChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Distribuição por Alojamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={alojamentoChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Satisfaction Overview */}
        {satisfactionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Índices de Satisfação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={satisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="question" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Bar dataKey="concordo" stackId="a" fill="#22c55e" name="Concordo" />
                  <Bar dataKey="neutro" stackId="a" fill="#eab308" name="Neutro" />
                  <Bar dataKey="discordo" stackId="a" fill="#ef4444" name="Discordo" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Rancho Distribution */}
        {ranchoChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Utilização dos Ranchos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ranchoChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Empty State */}
      {stats.totalResponses === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma resposta ainda
            </h3>
            <p className="text-gray-600">
              Quando as pesquisas começarem a ser enviadas, você verá os dados aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}