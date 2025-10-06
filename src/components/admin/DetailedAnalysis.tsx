import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Building2, Users, CheckCircle2, AlertCircle, Loader2, Award } from "lucide-react";
import { useSectionStats } from "@/hooks/useSectionStats";
import type { SectionStatsResponse } from "@shared/section-metadata";

const sectionsMeta = [
  {
    key: "environment" as const,
    title: "Ambiente de Trabalho",
    icon: Building2,
    description: "Condições físicas e disponibilidade de recursos",
  },
  {
    key: "relationship" as const,
    title: "Relacionamento",
    icon: Users,
    description: "Integração das equipes e liderança",
  },
  {
    key: "motivation" as const,
    title: "Motivação",
    icon: Award,
    description: "Desenvolvimento profissional e reconhecimento",
  },
];

type SectionSummary = {
  key: typeof sectionsMeta[number]["key"];
  title: string;
  description: string;
  score: number | null;
  sampleSize: number;
  icon: typeof Building2;
};

const getScoreBadge = (score: number | null) => {
  if (score === null) {
    return { variant: "secondary" as const, label: "Sem dados", icon: AlertCircle };
  }
  if (score >= 70) return { variant: "default" as const, label: "Bom", icon: CheckCircle2 };
  if (score >= 50) return { variant: "secondary" as const, label: "Atenção", icon: AlertCircle };
  return { variant: "destructive" as const, label: "Crítico", icon: AlertTriangle };
};

const recommendationMatrix: Record<SectionSummary["key"], {
  Alta: string;
  Média: string;
  Baixa: string;
}> = {
  environment: {
    Alta: "Revisar imediatamente as condições de infraestrutura e suprimentos para reduzir gargalos operacionais.",
    Média: "Priorizar manutenções e ajustes pontuais onde a satisfação está neutra.",
    Baixa: "Manter monitoramento contínuo da infraestrutura e reforçar canais de solicitação de recursos.",
  },
  relationship: {
    Alta: "Promover programas de integração, mentoria e capacitação de líderes para fortalecer vínculos.",
    Média: "Intensificar ações de comunicação e feedback entre setores.",
    Baixa: "Consolidar boas práticas de convivência e reconhecer equipes engajadas.",
  },
  motivation: {
    Alta: "Reestruturar planos de carreira e políticas de reconhecimento para elevar o engajamento.",
    Média: "Aprimorar feedbacks e oportunidades de desenvolvimento profissional.",
    Baixa: "Dar continuidade a iniciativas de valorização e acompanhar evoluções individuais.",
  },
};

const getRecommendationPriority = (score: number | null) => {
  if (score === null) return "Baixa" as const;
  if (score < 50) return "Alta" as const;
  if (score < 70) return "Média" as const;
  return "Baixa" as const;
};

const computeSectionSummary = (data?: SectionStatsResponse | null): { score: number | null; sampleSize: number } => {
  if (!data) {
    return { score: null, sampleSize: 0 };
  }

  const likertQuestions = data.questions.filter((question) => question.type === "likert" && question.average !== null);
  if (likertQuestions.length === 0) {
    return { score: null, sampleSize: 0 };
  }

  const average = likertQuestions.reduce((sum, question) => sum + (question.average ?? 0), 0) / likertQuestions.length;
  const totalSample = Math.max(...likertQuestions.map((question) => question.totalResponses), 0);

  return {
    score: Math.round(average * 20),
    sampleSize: totalSample,
  };
};

export function DetailedAnalysis() {
  const baseFilters = useMemo(() => ({}), []);
  const environment = useSectionStats("environment", baseFilters);
  const relationship = useSectionStats("relationship", baseFilters);
  const motivation = useSectionStats("motivation", baseFilters);

  const loading = environment.loading || relationship.loading || motivation.loading;
  const error = environment.error || relationship.error || motivation.error;

  const sectionSummaries: SectionSummary[] = useMemo(() => {
    return sectionsMeta.map((section) => {
      const stats = section.key === "environment" ? environment.data
        : section.key === "relationship" ? relationship.data
        : motivation.data;

      const { score, sampleSize } = computeSectionSummary(stats);
      return {
        key: section.key,
        title: section.title,
        description: section.description,
        score,
        sampleSize,
        icon: section.icon,
      };
    });
  }, [environment.data, relationship.data, motivation.data]);

  const criticalPoints = useMemo(() => {
    const questions = sectionsMeta.flatMap((section) => {
      const stats = section.key === "environment" ? environment.data
        : section.key === "relationship" ? relationship.data
        : motivation.data;

      if (!stats) {
        return [];
      }

      return stats.questions
        .filter((question) => question.type === "likert" && question.average !== null)
        .map((question) => ({
          section: section.title,
          question: question.label,
          score: Math.round((question.average ?? 0) * 20),
        }));
    });

    return questions
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [environment.data, relationship.data, motivation.data]);

  const recommendations = useMemo(() => {
    return sectionSummaries.map((section) => {
      const priority = getRecommendationPriority(section.score);
      return {
        priority,
        area: section.title,
        description: recommendationMatrix[section.key][priority],
        impact: priority === "Alta" ? "Alto" : priority === "Média" ? "Médio" : "Baixo",
      };
    });
  }, [sectionSummaries]);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Calculando análise detalhada...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {sectionSummaries.map((section) => {
          const badge = getScoreBadge(section.score);
          const IconComponent = section.icon;
          return (
            <Card key={section.key} className="bg-gradient-card">
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
                    <span className={`text-2xl font-bold ${badge.variant === "destructive" ? "text-destructive" : badge.variant === "secondary" ? "text-warning" : "text-success"}`}>
                      {section.score !== null ? `${section.score}%` : "-"}
                    </span>
                  </div>
                  <Progress value={section.score ?? 0} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Amostra considerada: {section.sampleSize > 0 ? `${section.sampleSize} respostas` : "Sem dados suficientes"}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
            {criticalPoints.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum dado suficiente para identificar pontos críticos.</p>
            )}
            {criticalPoints.map((point, index) => (
              <div key={`${point.question}-${index}`} className="flex items-center justify-between p-3 bg-warning-light rounded-lg border border-warning/20">
                <div className="flex-1">
                  <p className="text-sm font-medium">{point.question}</p>
                  <p className="text-xs text-muted-foreground">{point.section}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={point.score < 50 ? "text-destructive" : point.score < 70 ? "text-warning" : "text-success"}>
                    {point.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recomendações Prioritárias
          </CardTitle>
          <CardDescription>
            Ações sugeridas com base nos scores de cada área
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((recommendation) => (
              <div key={recommendation.area} className="rounded-lg border p-4 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{recommendation.area}</div>
                  <Badge variant={recommendation.priority === "Alta" ? "destructive" : recommendation.priority === "Média" ? "secondary" : "default"}>
                    Prioridade {recommendation.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  Impacto estimado: {recommendation.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
