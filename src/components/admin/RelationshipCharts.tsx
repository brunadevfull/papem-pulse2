import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const relationshipQuestions = [
  { id: "chefe_ouve_ideias", name: "Q21. Chefe Ouve Ideias", concordo: 55, neutro: 25, discordo: 20 },
  { id: "chefe_se_importa", name: "Q22. Chefe Se Importa", concordo: 48, neutro: 32, discordo: 20 },
  { id: "contribuir_atividades", name: "Q23. Contribuir Atividades", concordo: 72, neutro: 18, discordo: 10 },
  { id: "chefe_delega", name: "Q24. Chefe Delega", concordo: 52, neutro: 28, discordo: 20 },
  { id: "pares_auxiliam", name: "Q25. Pares Auxiliam", concordo: 68, neutro: 22, discordo: 10 },
  { id: "entrosamento_setores", name: "Q26. Entrosamento Setores", concordo: 45, neutro: 35, discordo: 20 },
  { id: "entrosamento_tripulacao", name: "Q27. Entrosamento Tripulação", concordo: 62, neutro: 25, discordo: 13 },
  { id: "convivio_agradavel", name: "Q28. Convívio Agradável", concordo: 65, neutro: 22, discordo: 13 },
  { id: "confianca_respeito", name: "Q29. Confiança e Respeito", concordo: 58, neutro: 27, discordo: 15 }
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


export function RelationshipCharts() {
  const [selectedSector, setSelectedSector] = useState("all");

  // Filter data based on selected sector
  const filteredData = selectedSector === "all" ? relationshipQuestions : 
    relationshipQuestions.map(q => ({
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