import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Award, Building2, Users, Target, CheckCircle2, AlertCircle } from "lucide-react";

const sectionScores = [
  {
    title: "Ambiente de Trabalho",
    score: 64,
    icon: Building2,
    description: "Condições físicas e recursos"
  },
  {
    title: "Relacionamento",
    score: 71,
    icon: Users,
    description: "Relações interpessoais"
  },
  {
    title: "Motivação",
    score: 58,
    icon: Award,
    description: "Desenvolvimento profissional"
  }
];

const criticalPoints = [
  { question: "Crescimento Profissional Estimulado", score: 38, section: "Motivação" },
  { question: "Trabalho Reconhecido e Valorizado", score: 42, section: "Motivação" },
  { question: "Materiais e Equipamentos Fornecidos", score: 45, section: "Ambiente" },
  { question: "Entrosamento entre Setores", score: 48, section: "Relacionamento" },
  { question: "Carga de Trabalho Justa", score: 52, section: "Motivação" },
];

const recommendations = [
  {
    priority: "Alta",
    area: "Desenvolvimento Profissional",
    description: "Implementar programa de capacitação e plano de carreira mais estruturado",
    impact: "Alto"
  },
  {
    priority: "Alta", 
    area: "Reconhecimento",
    description: "Estabelecer sistema de reconhecimento e feedback regular",
    impact: "Alto"
  },
  {
    priority: "Média",
    area: "Recursos Materiais",
    description: "Revisar processo de fornecimento de materiais e equipamentos",
    impact: "Médio"
  },
  {
    priority: "Média",
    area: "Integração",
    description: "Promover atividades de integração entre setores",
    impact: "Médio"
  }
];

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
};

const getScoreBadge = (score: number) => {
  if (score >= 70) return { variant: "default" as const, label: "Bom", icon: CheckCircle2 };
  if (score >= 50) return { variant: "secondary" as const, label: "Atenção", icon: AlertCircle };
  return { variant: "destructive" as const, label: "Crítico", icon: AlertTriangle };
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Alta": return "destructive";
    case "Média": return "secondary";
    default: return "default";
  }
};

export function DetailedAnalysis() {
  return (
    <div className="space-y-6">
      {/* Methodology Explanation */}
     

      {/* Section Scores */}
      <div className="grid gap-4 md:grid-cols-3">
        {sectionScores.map((section) => {
          const badge = getScoreBadge(section.score);
          const IconComponent = section.icon;
          
          return (
            <Card key={section.title} className="bg-gradient-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </div>
                  <Badge variant={badge.variant} className="flex items-center gap-1">
                    <badge.icon className="w-3 h-3" />
                    {badge.label}
                  </Badge>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Score Geral</span>
                    <span className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                      {section.score}%
                    </span>
                  </div>
                  <Progress value={section.score} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Critical Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Pontos que Precisam de Atenção
          </CardTitle>
          <CardDescription>
            As 5 questões com menores índices de satisfação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalPoints.map((point, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning-light rounded-lg border border-warning/20">
                <div className="flex-1">
                  <p className="text-sm font-medium">{point.question}</p>
                  <p className="text-xs text-muted-foreground">{point.section}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getScoreColor(point.score)}>
                    {point.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
