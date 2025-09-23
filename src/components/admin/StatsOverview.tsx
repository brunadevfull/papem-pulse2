import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, TrendingUp, Percent, BarChart } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const mockStats = {
  totalResponses: 136,
  mostActiveSection: "PAPEM-20",
  generalSatisfaction: 72.5,
  responseRate: 100.0
};

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-card shadow-custom-md hover:shadow-custom-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{mockStats.totalResponses}</div>
          <p className="text-xs text-muted-foreground">
            participações registradas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-custom-md hover:shadow-custom-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribuição por Setor</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium">Setor</span>
              <span className="font-medium">Respondentes</span>
            </div>
            <div className="space-y-2">
              {[
                { name: "PAPEM-20", count: 20, color: "#eab308" },
                { name: "PAPEM-51", count: 20, color: "#a855f7" },
                { name: "PAPEM-52", count: 20, color: "#f97316" },
                { name: "PAPEM-10", count: 19, color: "#22c55e" },
                { name: "PAPEM-30", count: 19, color: "#ef4444" },
                { name: "PAPEM-40", count: 19, color: "#3b82f6" },
                { name: "SECOM", count: 19, color: "#06b6d4" }
              ].map((setor, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: setor.color }}
                    />
                    <span className="text-xs font-medium truncate">{setor.name}</span>
                  </div>
                  <div className="text-xs font-bold text-primary">{setor.count}</div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Total:</span>
                <span className="text-sm font-bold text-primary">136</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-custom-md hover:shadow-custom-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfação Geral</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{mockStats.generalSatisfaction}%</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant={mockStats.generalSatisfaction > 70 ? "default" : "secondary"} className="text-xs">
              {mockStats.generalSatisfaction > 70 ? "Positivo" : "Atenção"}
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-custom-md hover:shadow-custom-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{mockStats.responseRate}%</div>
          <p className="text-xs text-muted-foreground">
            de 136 pessoas (MIL, servidores civis e TTC)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}