import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const motivationQuestions = [
  { id: "feedback_desempenho", name: "Q30. Feedback Desempenho", concordo: 38, neutro: 32, discordo: 30 },
  { id: "conceito_compativel", name: "Q31. Conceito Compatível", concordo: 55, neutro: 25, discordo: 20 },
  { id: "importancia_atividade", name: "Q32. Importância Atividade", concordo: 72, neutro: 18, discordo: 10 },
  { id: "trabalho_reconhecido", name: "Q33. Trabalho Reconhecido", concordo: 42, neutro: 28, discordo: 30 },
  { id: "crescimento_estimulado", name: "Q34. Crescimento Estimulado", concordo: 38, neutro: 32, discordo: 30 },
  { id: "cursos_suficientes", name: "Q35. Cursos Suficientes", concordo: 48, neutro: 30, discordo: 22 },
  { id: "programa_treinamento", name: "Q36. Programa Treinamento", concordo: 35, neutro: 35, discordo: 30 },
  { id: "orgulho_trabalhar", name: "Q37. Orgulho Trabalhar", concordo: 68, neutro: 20, discordo: 12 },
  { id: "bem_aproveitado", name: "Q38. Bem Aproveitado", concordo: 52, neutro: 28, discordo: 20 },
  { id: "potencial_outra_funcao", name: "Q39. Potencial Outra Função", concordo: 45, neutro: 30, discordo: 25 },
  { id: "carga_trabalho_justa", name: "Q40. Carga Trabalho Justa", concordo: 52, neutro: 25, discordo: 23 },
  { id: "licenca_autorizada", name: "Q41. Licença Autorizada", concordo: 65, neutro: 22, discordo: 13 }
];

const sectorOptions = [
  { value: "all", label: "Todos os setores" },
  { value: "PAPEM-10", label: "PAPEM-10" },
  { value: "PAPEM-20", label: "PAPEM-20" },
  { value: "PAPEM-30", label: "PAPEM-30" },
  { value: "PAPEM-40", label: "PAPEM-40" },
  { value: "PAPEM-51", label: "PAPEM-51" },
  { value: "PAPEM-52", label: "PAPEM-52" },
  { value: "SECOM", label: "SECOM" }
];


export function MotivationCharts() {
  const [selectedSector, setSelectedSector] = useState("all");

  // Filter data based on selected sector
  const filteredData = selectedSector === "all" ? motivationQuestions : 
    motivationQuestions.map(q => ({
      ...q,
      // Mock filtering - in real app, this would filter actual responses
      concordo: Math.floor(Math.random() * 40) + 30,
      neutro: Math.floor(Math.random() * 30) + 20,
      discordo: Math.floor(Math.random() * 30) + 15
    }));

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Filtrar por setor" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {sectorOptions.map((sector) => (
              <SelectItem key={sector.value} value={sector.value}>
                {sector.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {selectedSector === "all" ? "Mostrando todos os setores" : `Filtrado por: ${selectedSector}`}
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredData.map((question, index) => {
          const chartData = [
            { name: "Concordo", value: question.concordo, fill: "hsl(var(--success))" },
            { name: "Neutro", value: question.neutro, fill: "hsl(var(--warning))" },
            { name: "Discordo", value: question.discordo, fill: "hsl(var(--destructive))" }
          ];

          const barData = [
            { category: "Concordo", percentage: question.concordo, fill: "hsl(var(--success))" },
            { category: "Neutro", percentage: question.neutro, fill: "hsl(var(--warning))" },
            { category: "Discordo", percentage: question.discordo, fill: "hsl(var(--destructive))" }
          ];


          return (
            <Card 
              key={question.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {question.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={index * 200}
                        animationDuration={1000}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          background: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="space-y-3">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="category" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          background: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                        formatter={(value) => [`${value}%`, 'Percentual']}
                      />
                      <Bar 
                        dataKey="percentage" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1200}
                        animationBegin={index * 150}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Statistics Summary */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  {[
                    { label: "Positivo", value: question.concordo, color: "text-success", bg: "bg-success/10" },
                    { label: "Neutro", value: question.neutro, color: "text-warning", bg: "bg-warning/10" },
                    { label: "Negativo", value: question.discordo, color: "text-destructive", bg: "bg-destructive/10" }
                  ].map((stat, idx) => (
                    <div key={idx} className={`${stat.bg} rounded-lg p-2 text-center transition-all hover:scale-105`}>
                      <div className={`text-sm font-bold ${stat.color}`}>{stat.value}%</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}