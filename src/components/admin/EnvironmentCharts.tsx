import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Building2, Users, Clock, Home, Utensils, BarChart3 } from "lucide-react";

const environmentQuestions = [
  { id: "materiais_fornecidos", name: "Q2. Materiais Fornecidos", concordo: 45, neutro: 25, discordo: 30 },
  { id: "materiais_adequados", name: "Q3. Materiais Adequados", concordo: 52, neutro: 28, discordo: 20 },
  { id: "atendimento_apoio", name: "Q4. Atendimento Apoio", concordo: 38, neutro: 35, discordo: 27 },
  { id: "limpeza_adequada", name: "Q5. Limpeza Adequada", concordo: 65, neutro: 20, discordo: 15 },
  { id: "temperatura_adequada", name: "Q6. Temperatura Adequada", concordo: 42, neutro: 30, discordo: 28 },
  { id: "iluminacao_adequada", name: "Q7. Iluminação Adequada", concordo: 70, neutro: 18, discordo: 12 },
  { id: "localizacao_alojamento", name: "Q8. Localização do Alojamento", concordo: 55, neutro: 30, discordo: 15 },
  { id: "alojamento_condicoes", name: "Q9. As instalações do meu alojamento estão em boas condições.", concordo: 48, neutro: 32, discordo: 20 },
  { id: "banheiros_adequados", name: "Q10. As instalações dos banheiros da OM são adequadas.", concordo: 55, neutro: 25, discordo: 20 },
  { id: "praca_darmas_adequada", name: "Q11. Praça D'Armas", concordo: 62, neutro: 23, discordo: 15 },
  { id: "localizacao_rancho", name: "Q12. Localização do Rancho", concordo: 60, neutro: 25, discordo: 15 },
  { id: "rancho_instalacoes", name: "Q13. Considero adequadas as instalações do rancho.", concordo: 58, neutro: 27, discordo: 15 },
  { id: "rancho_qualidade", name: "Q14. Estou satisfeito com a qualidade da comida servida no rancho.", concordo: 43, neutro: 35, discordo: 22 },
  { id: "escala_atrapalha", name: "Q16. A escala de serviço tem atrapalhado as minhas tarefas profissionais.", concordo: 35, neutro: 28, discordo: 37 },
  { id: "equipamentos_servico", name: "Q17. Quando estou de serviço, percebo que os equipamentos utilizados estão em boas condições.", concordo: 47, neutro: 33, discordo: 20 },
  { id: "tfm_participa", name: "Q18. Participa TFM", concordo: 55, neutro: 22, discordo: 23 },
  { id: "tfm_incentivado", name: "Q19. TFM Incentivado", concordo: 48, neutro: 30, discordo: 22 },
  { id: "tfm_instalacoes", name: "Q20. Instalações TFM", concordo: 52, neutro: 28, discordo: 20 }
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

// Opções de filtro por dependências condicionais
const alojamentoOptions = [
  { value: "all", label: "Todos os alojamentos" },
  { value: "CB/MN MASCULINO", label: "CB/MN MASCULINO" },
  { value: "CB/MN FEMININO", label: "CB/MN FEMININO" },
  { value: "SO/SG MASCULINO", label: "SO/SG MASCULINO" },
  { value: "SO/SG FEMININO", label: "SO/SG FEMININO" },
  { value: "OFICIAIS FEMININO", label: "OFICIAIS FEMININO" },
  { value: "CT/1T MASCULINO", label: "CT/1T MASCULINO" },
  { value: "OFICIAIS SUPERIORES MASCULINO", label: "OFICIAIS SUPERIORES MASCULINO" }
];

const ranchoOptions = [
  { value: "all", label: "Todos os ranchos" },
  { value: "Distrito", label: "Distrito" },
  { value: "DABM", label: "DABM" },
  { value: "Praça D'armas", label: "Praça D'armas" }
];

const escalaOptions = [
  { value: "all", label: "Todas as escalas" },
  { value: "Oficiais", label: "Oficiais" },
  { value: "SG", label: "SG" },
  { value: "Cb/MN", label: "Cb/MN" }
];

export function EnvironmentCharts() {
  // Filtro GLOBAL - aplica-se a todas as questões
  const [selectedSector, setSelectedSector] = useState("all");
  
  // Filtros LOCAIS - cada um aplica-se apenas às suas questões específicas
  const [alojamentoFilter, setAlojamentoFilter] = useState("all"); // Aplica-se apenas a Q9-Q11
  const [ranchoFilter, setRanchoFilter] = useState("all");         // Aplica-se apenas a Q13-Q14
  const [escalaFilter, setEscalaFilter] = useState("all");         // Aplica-se apenas a Q16-Q17

  // Questões de localização (não são concordo/discordo)
  const getLocationQuestionData = (questionId: string, filters: any) => {
    const sampleSize = filters.sector !== "all" ? 
      (questionId === "localizacao_alojamento" ? 85 : 
       questionId === "localizacao_rancho" ? 92 : 78) : 100;

    if (questionId === "localizacao_alojamento") {
      // Dados base para alojamento
      let baseData = [
        { name: "CB/MN MASCULINO", baseValue: 28 },
        { name: "SO/SG MASCULINO", baseValue: 22 },
        { name: "CB/MN FEMININO", baseValue: 18 },
        { name: "OFICIAIS SUPERIORES", baseValue: 15 },
        { name: "CT/1T MASCULINO", baseValue: 12 },
        { name: "SO/SG FEMININO", baseValue: 5 }
      ];

      // Ajustar distribuições baseado no setor selecionado
      if (filters.sector !== "all") {
        const sectorAdjustments: { [key: string]: number[] } = {
          "PAPEM-10": [5, -3, 2, -1, -2, -1],
          "PAPEM-20": [-8, 5, 3, 0, 0, 0],
          "PAPEM-30": [12, -5, -3, -2, -1, -1],
          "PAPEM-40": [-3, -2, 1, 3, 1, 0],
          "PAPEM-51": [8, -4, -2, -1, -1, 0],
          "PAPEM-52": [-5, 3, 1, 1, 0, 0],
          "SECOM": [15, -8, -3, -2, -1, -1]
        };
        
        const adjustments = sectorAdjustments[filters.sector] || [0, 0, 0, 0, 0, 0];
        baseData = baseData.map((item, idx) => ({
          ...item,
          baseValue: Math.max(1, Math.min(70, item.baseValue + adjustments[idx]))
        }));
      }

      // Normalizar para 100%
      const total = baseData.reduce((sum, item) => sum + item.baseValue, 0);
      const data = baseData.map(item => {
        const value = Math.round((item.baseValue / total) * 100);
        return {
          name: item.name,
          value,
          count: Math.floor(sampleSize * (value / 100))
        };
      });

      return {
        id: questionId,
        name: "Q8. Localização do Alojamento",
        type: "location",
        data,
        sampleSize
      };
    }
    
    if (questionId === "localizacao_rancho") {
      // Dados base para rancho
      let baseData = [
        { name: "Distrito", baseValue: 45 },
        { name: "DABM", baseValue: 35 },
        { name: "Praça D'armas", baseValue: 20 }
      ];

      // Ajustar distribuições baseado no setor selecionado
      if (filters.sector !== "all") {
        const sectorAdjustments: { [key: string]: number[] } = {
          "PAPEM-10": [8, -5, -3],
          "PAPEM-20": [-12, 8, 4],
          "PAPEM-30": [15, -8, -7],
          "PAPEM-40": [-5, 2, 3],
          "PAPEM-51": [10, -6, -4],
          "PAPEM-52": [-8, 5, 3],
          "SECOM": [20, -12, -8]
        };
        
        const adjustments = sectorAdjustments[filters.sector] || [0, 0, 0];
        baseData = baseData.map((item, idx) => ({
          ...item,
          baseValue: Math.max(5, Math.min(80, item.baseValue + adjustments[idx]))
        }));
      }

      // Normalizar para 100%
      const total = baseData.reduce((sum, item) => sum + item.baseValue, 0);
      const data = baseData.map(item => {
        const value = Math.round((item.baseValue / total) * 100);
        return {
          name: item.name,
          value,
          count: Math.floor(sampleSize * (value / 100))
        };
      });

      return {
        id: questionId,
        name: "Q12. Localização do Rancho",
        type: "location",
        data,
        sampleSize
      };
    }
    
  };

  // Função auxiliar para determinar quais filtros se aplicam a uma questão específica
  const getApplicableFilters = (questionId: string) => {
    const filters = {
      sector: selectedSector, // Sempre aplica o filtro global
      alojamento: "all",      // Por padrão, filtros locais são "all"
      rancho: "all",
      escala: "all"
    };

    // Aplicar filtros locais apenas às questões relevantes
    if (["alojamento_condicoes", "banheiros_adequados"].includes(questionId)) {
      filters.alojamento = alojamentoFilter;
    } else if (["praca_darmas_adequada", "rancho_instalacoes", "rancho_qualidade"].includes(questionId)) {
      filters.rancho = ranchoFilter;
    } else if (["escala_atrapalha", "equipamentos_servico"].includes(questionId)) {
      filters.escala = escalaFilter;
    }

    return filters;
  };

  // Simular dados reais baseados nos filtros selecionados
  const getFilteredQuestionData = (questionId: string, customFilters?: any) => {
    // Usar filtros customizados ou determinar automaticamente baseado na questão
    const filters = customFilters || getApplicableFilters(questionId);
    // Verificar se é questão de localização
    if (["localizacao_alojamento", "localizacao_rancho"].includes(questionId)) {
      return getLocationQuestionData(questionId, filters);
    }

    const baseQuestion = environmentQuestions.find(q => q.id === questionId);
    if (!baseQuestion) return null;

    // Simular diferentes perfis de resposta baseados nos filtros aplicados
    let concordo = baseQuestion.concordo;
    let neutro = baseQuestion.neutro;
    let discordo = baseQuestion.discordo;
    let sampleSize = 100; // Tamanho da amostra padrão

    // Ajustar dados baseado no setor selecionado
    if (filters.sector !== "all") {
      // Simular variações reais por setor (baseado em dados típicos organizacionais)
      const sectorVariations: { [key: string]: { concordo: number, neutro: number, discordo: number, size: number } } = {
        "PAPEM-10": { concordo: 5, neutro: -2, discordo: -3, size: 85 },
        "PAPEM-20": { concordo: -8, neutro: 3, discordo: 5, size: 92 },
        "PAPEM-30": { concordo: 12, neutro: -5, discordo: -7, size: 78 },
        "PAPEM-40": { concordo: -3, neutro: -1, discordo: 4, size: 65 },
        "PAPEM-51": { concordo: 8, neutro: -3, discordo: -5, size: 45 },
        "PAPEM-52": { concordo: -5, neutro: 2, discordo: 3, size: 38 },
        "SECOM": { concordo: 15, neutro: -7, discordo: -8, size: 25 }
      };
      
      const variation = sectorVariations[filters.sector];
      if (variation) {
        concordo = Math.max(0, Math.min(100, concordo + variation.concordo));
        neutro = Math.max(0, Math.min(100, neutro + variation.neutro));
        discordo = Math.max(0, Math.min(100, discordo + variation.discordo));
        sampleSize = variation.size;
      }
    }

    // Aplicar filtros locais específicos apenas se relevantes para a questão
    const baseSampleSize = sampleSize;
    
    // Filtro de ALOJAMENTO (apenas para questões de alojamento Q9-Q10)
    if (filters.alojamento !== "all" && ["alojamento_condicoes", "banheiros_adequados"].includes(questionId)) {
      sampleSize = Math.floor(baseSampleSize * 0.3); // ~30% do setor para alojamento específico
      
      // Questões de alojamento tendem a ter avaliações mais críticas
      concordo = Math.max(0, concordo - 10);
      discordo = Math.min(100, discordo + 8);
    }
    
    // Filtro de RANCHO (apenas para questões de rancho Q11, Q13-Q14)
    if (filters.rancho !== "all" && ["praca_darmas_adequada", "rancho_instalacoes", "rancho_qualidade"].includes(questionId)) {
      sampleSize = Math.floor(baseSampleSize * 0.4); // ~40% do setor para rancho específico
      
      // Diferentes ranchos têm diferentes níveis de satisfação
      const ranchoImpact = filters.rancho === "Distrito" ? 5 : 
                          filters.rancho === "DABM" ? -8 : 
                          filters.rancho === "Praça D'armas" ? 12 : 0;
      concordo = Math.max(0, Math.min(100, concordo + ranchoImpact));
      discordo = Math.max(0, Math.min(100, discordo - Math.floor(ranchoImpact / 2)));
    }
    
    // Filtro de ESCALA (apenas para questões de escala Q16-Q17)
    if (filters.escala !== "all" && ["escala_atrapalha", "equipamentos_servico"].includes(questionId)) {
      sampleSize = Math.floor(baseSampleSize * 0.35); // ~35% do setor para escala específica
      
      // Diferentes escalas têm diferentes experiências
      const escalaImpact = filters.escala === "Oficiais" ? 8 : 
                          filters.escala === "SG" ? -2 : 
                          filters.escala === "Cb/MN" ? -6 : 0;
      concordo = Math.max(0, Math.min(100, concordo + escalaImpact));
      discordo = Math.max(0, Math.min(100, discordo - escalaImpact));
    }

    // Garantir que os percentuais somem 100%
    const total = concordo + neutro + discordo;
    if (total !== 100) {
      const factor = 100 / total;
      concordo = Math.round(concordo * factor);
      neutro = Math.round(neutro * factor);
      discordo = 100 - concordo - neutro;
    }

    return {
      ...baseQuestion,
      concordo,
      neutro,
      discordo,
      sampleSize
    };
  };

  // Sempre mostrar todas as questões - filtros apenas mudam os dados dos gráficos
  const getRelevantQuestions = () => {
    // Retornar todas as questões sempre
    return environmentQuestions;
  };

  const relevantQuestions = getRelevantQuestions();

  const renderQuestionCard = (question: any, index: number) => {
    // Questões de localização (Q8, Q12)
    if (question.type === "location") {
      const colors = [
        "hsl(220, 100%, 50%)", // Azul
        "hsl(280, 100%, 50%)", // Roxo
        "hsl(340, 100%, 50%)", // Rosa
        "hsl(40, 100%, 50%)",  // Laranja
        "hsl(140, 100%, 50%)", // Verde
        "hsl(60, 100%, 50%)"   // Amarelo
      ];

      const chartData = question.data.map((item: any, idx: number) => ({
        name: item.name,
        value: item.value,
        count: item.count,
        fill: colors[idx % colors.length]
      }));

      return (
        <Card 
          key={question.id} 
          className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {question.name}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Vertical Bar Chart ocupando toda a largura */}
            <div className="w-full">
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart 
                  data={chartData} 
                  margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', textAnchor: 'end' }}
                    angle={-45}
                    height={70}
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 'dataMax + 5']}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name, props) => [`${value}% (${props.payload.count} pessoas)`, props.payload.name]}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                    animationBegin={index * 100}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* Resumo abaixo do gráfico */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {chartData.map((item, idx) => (
                <div key={idx} className="text-center p-3 rounded-lg bg-muted/20 border">
                  <div className="text-lg font-bold" style={{ color: item.fill }}>
                    {item.value}%
                  </div>
                  <div className="text-xs text-muted-foreground font-medium truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.count} pessoas
                  </div>
                </div>
              ))}
            </div>

            {/* Lista de distribuição */}
            <div className="space-y-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs font-medium truncate">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.value}%</div>
                    <div className="text-xs text-muted-foreground">{item.count} pessoas</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Questões normais (concordo/discordo/neutro)
    const chartData = [
      { name: "Concordo", value: question.concordo, fill: "hsl(142, 76%, 36%)" },
      { name: "Neutro", value: question.neutro, fill: "hsl(45, 93%, 47%)" },
      { name: "Discordo", value: question.discordo, fill: "hsl(var(--destructive))" }
    ];

    const barData = [
      { category: "Concordo", percentage: question.concordo, fill: "hsl(142, 76%, 36%)" },
      { category: "Neutro", percentage: question.neutro, fill: "hsl(45, 93%, 47%)" },
      { category: "Discordo", percentage: question.discordo, fill: "hsl(var(--destructive))" }
    ];


    return (
      <Card 
        key={question.id} 
        className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-background to-muted/20 border-2 hover:border-primary/20 animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardHeader className="pb-4">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
              {question.name}
            </CardTitle>
          </div>
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
              <RechartsBarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
            {[
              { label: "Positivo", value: question.concordo, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20" },
              { label: "Neutro", value: question.neutro, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
              { label: "Negativo", value: question.discordo, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20" }
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
  };

  // Organizar questões em sequência correta
  const getQuestionsBySequence = () => {
    const questionsById = {};
    relevantQuestions.forEach(q => questionsById[q.id] = q);
    
    return {
      q2_q7: ['materiais_fornecidos', 'materiais_adequados', 'atendimento_apoio', 'limpeza_adequada', 'temperatura_adequada', 'iluminacao_adequada']
        .map(id => questionsById[id]).filter(Boolean),
      q8: [], // Cartão Q8 removido conforme solicitação
      q9_q10: ['alojamento_condicoes', 'banheiros_adequados']
        .map(id => questionsById[id]).filter(Boolean),
      q12: [], // Cartão Q12 removido conforme solicitação
      q11_q13_q14: ['praca_darmas_adequada', 'rancho_instalacoes', 'rancho_qualidade']
        .map(id => questionsById[id]).filter(Boolean),
      q16_q17: ['escala_atrapalha', 'equipamentos_servico']
        .map(id => questionsById[id]).filter(Boolean),
      q18_q20: ['tfm_participa', 'tfm_incentivado', 'tfm_instalacoes']
        .map(id => questionsById[id]).filter(Boolean)
    };
  };
  
  const sequencedQuestions = getQuestionsBySequence();

  const renderQuestionGroup = (questions: any[], title: string, filterComponent?: React.ReactNode) => {
    if (!questions || questions.length === 0) {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <p className="text-gray-600 text-sm">{title} - Nenhuma questão disponível</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {title} ({questions.length} questões)
          </h3>
          {filterComponent}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {questions.map((question, index) => {
            const filteredQuestion = getFilteredQuestionData(question.id, {
              sector: selectedSector,
              alojamento: alojamentoFilter,
              rancho: ranchoFilter,
              escala: escalaFilter
            });
            
            // Não mostrar gráfico se amostra muito pequena
            if (!filteredQuestion || filteredQuestion.sampleSize < 5) {
              return (
                <Card key={question.id} className="p-6 bg-muted/20 border-dashed">
                  <div className="text-center">
                    <h4 className="font-medium text-sm mb-2">{question.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Dados insuficientes para exibição
                    </p>
                  </div>
                </Card>
              );
            }
            
            return renderQuestionCard(filteredQuestion, index);
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">

      {/* Filtro Global Destacado */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-indigo-800 dark:text-indigo-200">
                  🌐 Filtro Global - Setor
                </CardTitle>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  Este filtro se aplica a todas as questões e análises abaixo
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
              Global
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700 h-12 text-base">
                  <SelectValue placeholder="Selecionar setor" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700">
                  {sectorOptions.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
              <span className="font-medium">
Mostrando dados
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard de Distribuições */}
      <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            📊 Visão Geral - Distribuições
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Panorama geral da participação por diferentes categorias
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Distribuição por Setor */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Por Setor
              </h4>
              <div className="space-y-3">
                {[
                  { name: "PAPEM-20", value: 15, color: "#eab308", count: 20 },
                  { name: "PAPEM-51", value: 15, color: "#a855f7", count: 20 },
                  { name: "PAPEM-52", value: 15, color: "#f97316", count: 20 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          backgroundColor: item.color, 
                          width: `${item.value * 6.5}%` // Escalar para visualização (15% = ~97px)
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{item.count} pessoas</div>
                  </div>
                ))}
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                  +4 setores adicionais
                </div>
              </div>
            </div>

            {/* Distribuição por Escala */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Por Escala
              </h4>
              <div className="space-y-3">
                {[
                  { name: "Cb/MN", value: 57, color: "#f59e0b", count: 78 },
                  { name: "SG", value: 28, color: "#10b981", count: 38 },
                  { name: "Oficiais", value: 15, color: "#3b82f6", count: 20 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          backgroundColor: item.color, 
                          width: `${Math.min(item.value * 1.7, 100)}%` // Escalar para visualização
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{item.count} pessoas</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribuição por Alojamento (Q8) */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Alojamentos
              </h4>
              <div className="space-y-3">
                {(() => {
                  const alojamentoData = getLocationQuestionData("localizacao_alojamento", { sector: selectedSector });
                  if (!alojamentoData?.data) return null;
                  
                  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316"];
                  return alojamentoData.data.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: colors[idx] || "#6b7280", 
                            width: `${Math.min(item.value * 2, 100)}%`
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{item.count} pessoas</div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Distribuição por Rancho (Q12) */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Ranchos
              </h4>
              <div className="space-y-3">
                {(() => {
                  const ranchoData = getLocationQuestionData("localizacao_rancho", { sector: selectedSector });
                  if (!ranchoData?.data) return null;
                  
                  const colors = ["#10b981", "#f59e0b", "#ef4444"];
                  return ranchoData.data.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: colors[idx] || "#6b7280", 
                            width: `${Math.min(item.value * 1.5, 100)}%`
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{item.count} pessoas</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 💼 SEÇÃO: TRABALHO GERAL */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border-l-4 border-gray-400 dark:border-gray-600 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <BarChart3 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                💼 Condições de Trabalho
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Questões gerais sobre ambiente de trabalho e condições de serviço
              </p>
            </div>
          </div>
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            Afetado pelo filtro global SETOR
          </Badge>
        </div>
        {renderQuestionGroup(sequencedQuestions.q2_q7, "Q2-Q7: Condições de Trabalho, Serviço e TFM")}
      </div>

      {/* 🏠 SEÇÃO: ALOJAMENTO */}
      <div className="space-y-6">
        {/* Q8: Cartão removido conforme solicitação do usuário */}
        
        {/* Filtro Local de Alojamento */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded">
                <Home className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                  Filtro Local - Alojamento
                </h4>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Aplica-se apenas às questões específicas abaixo
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              Local
            </Badge>
          </div>
          <Select value={alojamentoFilter} onValueChange={setAlojamentoFilter}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 max-w-xs">
              <SelectValue placeholder="Filtrar por alojamento" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700">
              {alojamentoOptions.map((alojamento) => (
                <SelectItem key={alojamento.value} value={alojamento.value}>
                  {alojamento.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Q9-Q10: Questões Específicas de Alojamento (logo após a localização) */}
        {sequencedQuestions.q9_q10 && sequencedQuestions.q9_q10.length > 0 ? 
          renderQuestionGroup(sequencedQuestions.q9_q10, "Questões Específicas de Alojamento") :
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Q9: As instalações do meu alojamento estão em boas condições.</h4>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm">Gráfico de satisfação - Concordo: 48% | Neutro: 32% | Discordo: 20%</p>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Q10: As instalações dos banheiros da OM são adequadas.</h4>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm">Gráfico de satisfação - Concordo: 55% | Neutro: 25% | Discordo: 20%</p>
              </div>
            </Card>
          </div>
        }
      </div>

      {/* 🍽️ SEÇÃO: RANCHO */}
      <div className="space-y-6">
        {/* Q12: Cartão removido conforme solicitação do usuário */}
        
        {/* Filtro Local de Rancho */}
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded">
                <Utensils className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Filtro Local - Rancho
                </h4>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Aplica-se apenas às questões específicas abaixo
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Local
            </Badge>
          </div>
          <Select value={ranchoFilter} onValueChange={setRanchoFilter}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 max-w-xs">
              <SelectValue placeholder="Filtrar por rancho" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
              {ranchoOptions.map((rancho) => (
                <SelectItem key={rancho.value} value={rancho.value}>
                  {rancho.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Q11, Q13-Q14: Questões Específicas de Rancho (logo após a localização) */}
        {sequencedQuestions.q11_q13_q14 && sequencedQuestions.q11_q13_q14.length > 0 ? 
          renderQuestionGroup(sequencedQuestions.q11_q13_q14, "Questões Específicas de Rancho") :
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Q13: Considero adequadas as instalações do rancho.</h4>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm">Gráfico de satisfação - Concordo: 58% | Neutro: 27% | Discordo: 15%</p>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Q14: Estou satisfeito com a qualidade da comida servida no rancho.</h4>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm">Gráfico de satisfação - Concordo: 43% | Neutro: 35% | Discordo: 22%</p>
              </div>
            </Card>
          </div>
        }
      </div>


      {/* ⏰ SEÇÃO: ESCALA DE SERVIÇO */}
      <div className="space-y-6">
        {/* Filtro Local de Escala */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  Filtro Local - Escala
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Aplica-se apenas às questões específicas abaixo
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              Local
            </Badge>
          </div>
          <Select value={escalaFilter} onValueChange={setEscalaFilter}>
            <SelectTrigger className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 max-w-xs">
              <SelectValue placeholder="Filtrar por escala" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700">
              {escalaOptions.map((escala) => (
                <SelectItem key={escala.value} value={escala.value}>
                  {escala.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Q16-Q17: Questões Específicas de Escala de Serviço */}
        {renderQuestionGroup(sequencedQuestions.q16_q17, "Questões Específicas de Escala de Serviço")}
      </div>

      {/* 💼 SEÇÃO: TFM */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-l-4 border-purple-400 dark:border-purple-600 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                💪 TFM - Treinamento Físico Militar
              </h2>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                Questões sobre participação e instalações de TFM
              </p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
            Afetado pelo filtro global SETOR
          </Badge>
        </div>
        {renderQuestionGroup(sequencedQuestions.q18_q20, "Q18-Q20: TFM")}
      </div>

    </div>
  );
}
