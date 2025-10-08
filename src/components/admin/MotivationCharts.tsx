import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { AlertCircle, Loader2 } from "lucide-react";
import { motivationQuestions, type SectionStatsResponse } from "@shared/section-metadata";
import { useSectionStats } from "@/hooks/useSectionStats";
import { ratingToNumber, ratingToPercentage } from "@/hooks/useStats";

const sectorOptions = [
  { value: "all", label: "Todos os setores" },
  { value: "PAPEM-10", label: "PAPEM-10" },
  { value: "PAPEM-20", label: "PAPEM-20" },
  { value: "PAPEM-30", label: "PAPEM-30" },
  { value: "PAPEM-40", label: "PAPEM-40" },
  { value: "PAPEM-51", label: "PAPEM-51" },
  { value: "PAPEM-52", label: "PAPEM-52" },
  { value: "SECOM", label: "SECOM" },
];

const mapRatingToCategory = (rating: string) => {
  switch (rating) {
    case "Concordo totalmente":
    case "Muito Satisfeito":
      return "concordoTotalmente" as const;
    case "Concordo":
    case "Satisfeito":
      return "concordo" as const;
    case "Discordo totalmente":
    case "Muito Insatisfeito":
      return "discordoTotalmente" as const;
    case "Discordo":
    case "Insatisfeito":
      return "discordo" as const;
    case "Não concordo e nem discordo":
    case "Neutro":
      return "neutro" as const;
    default:
      return ratingToNumber(rating) >= 4 ? "concordo" : "discordo";
  }
};

export function MotivationCharts() {
  const [selectedSector, setSelectedSector] = useState("all");
  const { data, loading, error } = useSectionStats("motivation", useMemo(() => ({
    ...(selectedSector !== "all" ? { setor: selectedSector } : {}),
  }), [selectedSector]));

  const questionsById = useMemo(() => {
    const map = new Map<string, SectionStatsResponse["questions"][number]>();
    if (data) {
      data.questions.forEach((question) => {
        map.set(question.questionId as string, question);
      });
    }
    return map;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-[220px] bg-background">
            <SelectValue placeholder="Filtrar por setor" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {sectorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSector !== "all" && (
          <span className="text-sm text-muted-foreground">Filtrado por {selectedSector}</span>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando dados de motivação...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        {motivationQuestions.map((question) => {
          const stats = questionsById.get(question.id as string);
          const totalResponses = stats?.totalResponses ?? 0;

          if (!stats && !loading) {
            return null;
          }

          const percentages = ratingToPercentage(stats?.ratings ?? []);
          const counts = {
            concordoTotalmente: 0,
            concordo: 0,
            discordo: 0,
            discordoTotalmente: 0,
            neutro: 0,
          };
          stats?.ratings.forEach((entry) => {
            const category = mapRatingToCategory(entry.rating);
            if (category in counts) {
              counts[category as keyof typeof counts] += entry.count;
            }
          });

          const chartData = [
            {
              category: "Concordo totalmente",
              key: "concordoTotalmente" as const,
              percentage: percentages.concordoTotalmente,
              count: counts.concordoTotalmente,
              fill: "hsl(var(--success))",
            },
            {
              category: "Concordo",
              key: "concordo" as const,
              percentage: percentages.concordo,
              count: counts.concordo,
              fill: "#4ade80",
            },
            {
              category: "Discordo",
              key: "discordo" as const,
              percentage: percentages.discordo,
              count: counts.discordo,
              fill: "#f97316",
            },
            {
              category: "Discordo totalmente",
              key: "discordoTotalmente" as const,
              percentage: percentages.discordoTotalmente,
              count: counts.discordoTotalmente,
              fill: "hsl(var(--destructive))",
            },
          ];

          const neutroPercentage = 'neutro' in percentages ? percentages.neutro : undefined;
          if (typeof neutroPercentage === "number" && counts.neutro > 0) {
            chartData.splice(2, 0, {
              category: "Neutro (legado)",
              key: "neutro" as const,
              percentage: neutroPercentage,
              count: counts.neutro,
              fill: "#94a3b8",
            });
          }

          const averageScore = stats?.average ? Math.round(stats.average * 20) : null;

          return (
            <Card key={question.id} className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{question.label}</CardTitle>
                <CardDescription>
                  {totalResponses > 0
                    ? `${totalResponses} respostas registradas`
                    : "Sem respostas registradas"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${value}%`} width={40} />
                    <Tooltip
                      formatter={(value: number, _name, props) => [
                        `${value}% (${props.payload.count} respostas)`,
                        props.payload.category,
                      ]}
                      contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={`${question.id}-${entry.category}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {chartData.map((entry) => (
                    <span key={entry.category} className="flex items-center gap-2 rounded-full border px-3 py-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                      {entry.category}: {entry.percentage}%
                    </span>
                  ))}
                </div>

                {averageScore !== null && (
                  <div className="text-sm text-muted-foreground">
                    Média ponderada: <span className="font-medium text-foreground">{averageScore}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
