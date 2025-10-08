import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { AlertCircle, Loader2 } from "lucide-react";
import { environmentQuestions, type SectionStatsResponse } from "@shared/section-metadata";
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
  { value: "SECOM", label: "SECOM" }
];

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

const categoricalColors = [
  "hsl(222 89% 60%)",
  "hsl(263 70% 55%)",
  "hsl(17 90% 58%)",
  "hsl(150 65% 45%)",
  "hsl(45 90% 55%)",
  "hsl(200 80% 55%)"
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

export function EnvironmentCharts() {
  const [selectedSector, setSelectedSector] = useState("all");
  const [alojamentoFilter, setAlojamentoFilter] = useState("all");
  const [ranchoFilter, setRanchoFilter] = useState("all");
  const [escalaFilter, setEscalaFilter] = useState("all");

  const filters = useMemo(() => ({
    ...(selectedSector !== "all" ? { setor: selectedSector } : {}),
    ...(alojamentoFilter !== "all" ? { alojamento: alojamentoFilter } : {}),
    ...(ranchoFilter !== "all" ? { rancho: ranchoFilter } : {}),
    ...(escalaFilter !== "all" ? { escala: escalaFilter } : {}),
  }), [selectedSector, alojamentoFilter, ranchoFilter, escalaFilter]);

  const { data, loading, error } = useSectionStats("environment", filters);

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
      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="bg-background">
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

        <Select value={alojamentoFilter} onValueChange={setAlojamentoFilter}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrar por alojamento" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {alojamentoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ranchoFilter} onValueChange={setRanchoFilter}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrar por rancho" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {ranchoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={escalaFilter} onValueChange={setEscalaFilter}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Filtrar por escala" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            {escalaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando dados de ambiente...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {environmentQuestions.map((question, index) => {
          const stats = questionsById.get(question.id as string);
          const totalResponses = stats?.totalResponses ?? 0;

          if (!stats && !loading) {
            return null;
          }

          if (question.type === "categorical") {
            const chartData = (stats?.ratings || []).map((entry, idx) => ({
              name: entry.rating || "Não informado",
              count: entry.count,
              percentage: totalResponses > 0 ? Math.round((entry.count / totalResponses) * 100) : 0,
              fill: categoricalColors[idx % categoricalColors.length],
            }));

            return (
              <Card key={question.id} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{question.label}</CardTitle>
                  <CardDescription>
                    {totalResponses > 0
                      ? `${totalResponses} respostas consideradas`
                      : "Sem respostas registradas para esta pergunta"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {totalResponses > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                          <YAxis tickFormatter={(value) => `${value}%`} width={40} />
                          <Tooltip
                            formatter={(value: number, _name, props) => [
                              `${props.payload.percentage}% (${props.payload.count} respostas)`,
                              props.payload.name,
                            ]}
                            contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                          />
                          <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, idx) => (
                              <Cell key={`${question.id}-${entry.name}-${idx}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>

                      <div className="space-y-3">
                        {chartData.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                              <span className="text-sm font-medium">{entry.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.count} respostas ({entry.percentage}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Os filtros selecionados não possuem respostas para esta pergunta.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
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
              <CardHeader>
                <CardTitle className="text-base font-semibold">{question.label}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  {totalResponses > 0 ? (
                    <>
                      <Badge variant="secondary">{totalResponses} respostas</Badge>
                      {averageScore !== null && (
                        <span className="text-muted-foreground">Média: {averageScore}%</span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Nenhuma resposta registrada</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={220}>
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

                <div className="flex flex-wrap gap-2">
                  {chartData.map((entry) => (
                    <Badge key={entry.category} variant="outline" className="flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                      {entry.category}: {entry.percentage}%
                    </Badge>
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
