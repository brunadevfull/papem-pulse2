import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Lightbulb, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const mockOpenAnswers = [
  {
    id: 1,
    setor: "PAPEM-10",
    aspecto_positivo: "A equipe é muito unida e sempre se ajudam mutuamente. O ambiente de camaradagem é excelente.",
    aspecto_negativo: "A falta de equipamentos adequados dificulta algumas atividades do dia a dia.",
    proposta_processo: "Seria interessante implementar um sistema digital para controle de materiais.",
    proposta_satisfacao: "Mais atividades de confraternização e reconhecimento pelos trabalhos realizados."
  },
  {
    id: 2,
    setor: "PAPEM-20",
    aspecto_positivo: "A liderança é respeitosa e sempre aberta ao diálogo.",
    aspecto_negativo: "Os horários das escalas poderiam ser melhor distribuídos.",
    proposta_processo: "Automatizar alguns processos administrativos que ainda são manuais.",
    proposta_satisfacao: "Criar um programa de capacitação contínua para os militares."
  },
  {
    id: 3,
    setor: "PAPEM-30",
    aspecto_positivo: "Excelente estrutura física e bom ambiente de trabalho.",
    aspecto_negativo: "Comunicação entre setores poderia ser mais eficiente.",
    proposta_processo: "Implementar reuniões semanais entre chefes de setor.",
    proposta_satisfacao: "Estabelecer metas claras e sistema de premiação por desempenho."
  },
  {
    id: 4,
    setor: "PAPEM-40",
    aspecto_positivo: "Boa comunicação interna e transparência nas decisões.",
    aspecto_negativo: "Falta de material de escritório e equipamentos básicos.",
    proposta_processo: "Melhorar o processo de solicitação de materiais.",
    proposta_satisfacao: "Promover mais eventos de integração entre as equipes."
  },
  {
    id: 5,
    setor: "SECOM",
    aspecto_positivo: "Ambiente colaborativo e apoio mútuo entre colegas.",
    aspecto_negativo: "Necessidade de melhor infraestrutura de TI.",
    proposta_processo: "Digitalizar processos de comunicação interna.",
    proposta_satisfacao: "Implementar programa de reconhecimento por mérito."
  }
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

export function OpenAnswersSection() {
  const [selectedSector, setSelectedSector] = useState("all");

  // Filter answers based on selected sector
  const filteredAnswers = selectedSector === "all" ? mockOpenAnswers : 
    mockOpenAnswers.filter(answer => answer.setor === selectedSector);

  const categories = [
    {
      title: "Aspectos Positivos",
      icon: ThumbsUp,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      field: "aspecto_positivo"
    },
    {
      title: "Aspectos Negativos",
      icon: ThumbsDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10", 
      borderColor: "border-destructive/20",
      field: "aspecto_negativo"
    },
    {
      title: "Propostas de Processos",
      icon: Lightbulb,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20", 
      field: "proposta_processo"
    },
    {
      title: "Propostas de Satisfação",
      icon: Heart,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      field: "proposta_satisfacao"
    }
  ];

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

      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-foreground">Respostas Abertas</h3>
        <p className="text-muted-foreground">
          Análise qualitativa das sugestões e comentários da tripulação ({filteredAnswers.length} respostas{selectedSector !== "all" ? ` - ${selectedSector}` : ""})
        </p>
      </div>

      {categories.map((category) => {
        const Icon = category.icon;
        
        return (
          <Card key={category.field} className="survey-card">
            <CardHeader className={`${category.bgColor} ${category.borderColor} border-b`}>
              <CardTitle className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${category.color}`} />
                {category.title}
                <Badge variant="secondary" className="ml-auto">
                  {filteredAnswers.length} respostas
                </Badge>
              </CardTitle>
              <CardDescription>
                Comentários e sugestões sobre {category.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-6 space-y-4">
                  {filteredAnswers.map((answer, index) => (
                    <div key={answer.id}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span>Resposta #{answer.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {answer.setor}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground bg-muted/30 p-4 rounded-lg">
                          {answer[category.field as keyof typeof answer]}
                        </p>
                      </div>
                      {index < filteredAnswers.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}

    </div>
  );
}