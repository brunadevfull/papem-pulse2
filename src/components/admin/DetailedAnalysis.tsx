import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Award,
  Building2,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useStats } from "@/hooks/useStats";

const QUESTION_LABELS = {
  materiais_fornecidos: "Materiais fornecidos",
  materiais_adequados: "Materiais adequados",
  atendimento_apoio: "Atendimento e apoio",
  limpeza_adequada: "Limpeza adequada",
  temperatura_adequada: "Temperatura adequada",
  iluminacao_adequada: "Iluminação adequada",
  alojamento_condicoes: "Condições do alojamento",
  banheiros_adequados: "Banheiros adequados",
  praca_darmas_adequada: "Praça d'armas adequada",
  rancho_instalacoes: "Instalações do rancho",
  rancho_qualidade: "Qualidade da alimentação",
  escala_atrapalha: "Escala de serviço impacta",
  equipamentos_servico: "Equipamentos em serviço",
  tfm_participa: "Participa do TFM",
  tfm_incentivado: "TFM é incentivado",
  tfm_instalacoes: "Instalações para TFM",
  chefe_ouve_ideias: "Chefia ouve ideias",
  chefe_se_importa: "Chefia se importa",
  contribuir_atividades: "Posso contribuir nas atividades",
  chefe_delega: "Chefia delega tarefas",
  pares_auxiliam: "Pares auxiliam",
  entrosamento_setores: "Entrosamento entre setores",
  entrosamento_tripulacao: "Entrosamento da tripulação",
  convivio_agradavel: "Convívio agradável",
  confianca_respeito: "Confiança e respeito",
  feedback_desempenho: "Recebo feedback de desempenho",
  conceito_compativel: "Conceito compatível",
  importancia_atividade: "Atividade é importante",
  trabalho_reconhecido: "Trabalho reconhecido",
  crescimento_estimulado: "Crescimento estimulado",
  cursos_suficientes: "Cursos suficientes",
  programa_treinamento: "Programa de treinamento",
  orgulho_trabalhar: "Orgulho em trabalhar",
  bem_aproveitado: "Sou bem aproveitado",
  potencial_outra_funcao: "Potencial em outra função",
  carga_trabalho_justa: "Carga de trabalho justa",
  licenca_autorizada: "Licença autorizada",
} as const;

type QuestionKey = keyof typeof QUESTION_LABELS;

type SectionConfig = {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  recommendation: string;
  questions: QuestionKey[];
};

const SECTION_CONFIG: SectionConfig[] = [
  {
    id: "ambiente",
    title: "Ambiente de Trabalho",
    description: "Condições físicas e recursos disponíveis no cotidiano",
    icon: Building2,
    recommendation:
      "Priorizar investimentos em infraestrutura, logística e suporte operacional para reduzir gargalos cotidianos.",
    questions: [
      "materiais_fornecidos",
      "materiais_adequados",
      "atendimento_apoio",
      "limpeza_adequada",
      "temperatura_adequada",
      "iluminacao_adequada",
      "alojamento_condicoes",
      "banheiros_adequados",
      "praca_darmas_adequada",
      "rancho_instalacoes",
      "rancho_qualidade",
      "equipamentos_servico",
      "escala_atrapalha",
      "tfm_instalacoes",
    ],
  },
  {
    id: "relacionamento",
    title: "Relacionamento",
    description: "Qualidade das interações e do clima entre equipes",
    icon: Users,
    recommendation:
      "Fortalecer práticas de liderança participativa e ações que promovam integração entre setores e tripulação.",
    questions: [
      "chefe_ouve_ideias",
      "chefe_se_importa",
      "contribuir_atividades",
      "chefe_delega",
      "pares_auxiliam",
      "entrosamento_setores",
      "entrosamento_tripulacao",
      "convivio_agradavel",
      "confianca_respeito",
    ],
  },
  {
    id: "motivacao",
    title: "Motivação",
    description: "Desenvolvimento, reconhecimento e equilíbrio do trabalho",
    icon: Award,
    recommendation:
      "Estruturar planos de carreira, reconhecimento contínuo e gestão da carga de trabalho para aumentar o engajamento.",
    questions: [
      "feedback_desempenho",
      "conceito_compativel",
      "importancia_atividade",
      "trabalho_reconhecido",
      "crescimento_estimulado",
      "cursos_suficientes",
      "programa_treinamento",
      "orgulho_trabalhar",
      "bem_aproveitado",
      "potencial_outra_funcao",
      "carga_trabalho_justa",
      "licenca_autorizada",
      "tfm_participa",
      "tfm_incentivado",
    ],
  },
];

type QuestionScore = {
  id: QuestionKey;
  label: string;
  sectionId: string;
  sectionTitle: string;
  score: number | null;
};

type SectionScore = SectionConfig & { score: number | null };

const getScoreColor = (score: number | null) => {
  if (score === null) return "text-muted-foreground";
  if (score >= 70) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
};

const getScoreBadge = (score: number | null) => {
  if (score === null) {
    return { variant: "outline" as const, label: "Sem dados", icon: AlertCircle };
  }
  if (score >= 70) return { variant: "default" as const, label: "Bom", icon: CheckCircle2 };
  if (score >= 50) return { variant: "secondary" as const, label: "Atenção", icon: AlertCircle };
  return { variant: "destructive" as const, label: "Crítico", icon: AlertTriangle };
};

const getPriorityColor = (priority: "Alta" | "Média" | "Baixa") => {
  switch (priority) {
    case "Alta":
      return "destructive";
    case "Média":
      return "secondary";
    default:
      return "default";
  }
};

const evaluatePriority = (score: number) => {
  if (score < 50) {
    return { priority: "Alta" as const, impact: "Alto" };
  }
  if (score < 70) {
    return { priority: "Média" as const, impact: "Médio" };
  }
  return { priority: "Baixa" as const, impact: "Baixo" };
};

export function DetailedAnalysis() {
  const { analytics, loading, error, refetch } = useStats();

  const sectionScores: SectionScore[] = useMemo(() => {
    return SECTION_CONFIG.map((section) => {
      const averages = section.questions
        .map((questionId) => analytics?.satisfactionAverages?.[questionId] ?? null)
        .filter((value): value is number => typeof value === "number");

      if (averages.length === 0) {
        return { ...section, score: null };
      }

      const averageScore =
        (averages.reduce((sum, value) => sum + value, 0) / averages.length) * 20;

      return { ...section, score: Math.round(averageScore) };
    });
  }, [analytics]);

  const questionScores: QuestionScore[] = useMemo(() => {
    return SECTION_CONFIG.flatMap((section) =>
      section.questions.map((questionId) => {
        const average = analytics?.satisfactionAverages?.[questionId] ?? null;
        const score = typeof average === "number" ? Math.round(average * 20) : null;

        return {
          id: questionId,
          label: QUESTION_LABELS[questionId],
          sectionId: section.id,
          sectionTitle: section.title,
          score,
        };
      })
    );
  }, [analytics]);

  const criticalPoints = useMemo(() => {
    const scoredQuestions = questionScores.filter(
      (question): question is QuestionScore & { score: number } => typeof question.score === "number"
    );

    return scoredQuestions
      .slice()
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [questionScores]);

  const recommendations = useMemo(() => {
    const priorityOrder: Record<"Alta" | "Média" | "Baixa", number> = { Alta: 0, Média: 1, Baixa: 2 };

    const entries = sectionScores
      .filter((section): section is SectionScore & { score: number } => typeof section.score === "number")
      .map((section) => {
        const { priority, impact } = evaluatePriority(section.score);
        const sectionQuestions = questionScores
          .filter((question): question is QuestionScore & { score: number } =>
            question.sectionId === section.id && typeof question.score === "number"
          )
          .sort((a, b) => a.score - b.score);

        const focusQuestion = sectionQuestions[0];
        const description = focusQuestion
          ? `${section.recommendation} Foco na questão "${focusQuestion.label}" (${focusQuestion.score}%).`
          : section.recommendation;

        return {
          priority,
          impact,
          area: section.title,
          description,
        };
      })
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return entries;
  }, [questionScores, sectionScores]);

  const hasSectionScores = sectionScores.some((section) => typeof section.score === "number");

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-3 bg-muted rounded w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-24 mb-3" />
                <div className="h-2 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-48" />
            <div className="h-3 bg-muted rounded w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-12 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-48" />
            <div className="h-3 bg-muted rounded w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-14 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-destructive">Erro ao carregar dados: {error}</div>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!analytics || !hasSectionScores) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Nenhum dado analítico disponível
          </CardTitle>
          <CardDescription>
            As recomendações serão exibidas automaticamente assim que houver respostas suficientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar dados
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-primary" />
            Metodologia de Análise
          </CardTitle>
          <CardDescription>
            As médias de cada pergunta são convertidas em percentuais (1-5 → 20%-100%) e agrupadas por tema para gerar os
            indicadores abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Os pontos críticos apresentam as menores avaliações individuais e orientam as recomendações automáticas por
            prioridade.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {sectionScores.map((section) => {
          const badge = getScoreBadge(section.score);
          const IconComponent = section.icon;

          return (
            <Card key={section.id} className="bg-gradient-card">
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
                    <span className="text-sm font-medium">Score geral</span>
                    <span className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                      {section.score !== null ? `${section.score}%` : "--"}
                    </span>
                  </div>
                  <Progress value={section.score ?? 0} className="h-2" />
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
            Pontos que precisam de atenção
          </CardTitle>
          <CardDescription>As cinco questões com menores índices de satisfação em toda a pesquisa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalPoints.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Nenhuma questão crítica disponível no momento.
              </div>
            )}
            {criticalPoints.map((point) => (
              <div
                key={point.id}
                className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{point.label}</p>
                  <p className="text-xs text-muted-foreground">{point.sectionTitle}</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Recomendações priorizadas
          </CardTitle>
          <CardDescription>Priorização automática baseada nas médias das seções e pontos críticos associados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Aguarde novas respostas para gerar recomendações personalizadas.
              </div>
            )}
            {recommendations.map((recommendation, index) => (
              <div
                key={`${recommendation.area}-${index}`}
                className="flex flex-col gap-2 p-4 rounded-lg border border-border/60 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{recommendation.area}</p>
                    <p className="text-xs text-muted-foreground">Impacto: {recommendation.impact}</p>
                  </div>
                  <Badge variant={getPriorityColor(recommendation.priority)}>{recommendation.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

