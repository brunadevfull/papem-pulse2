import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  aggregateRatings,
  useSectionStats
} from "@/hooks/useSectionStats";
import { Badge } from "@/components/ui/badge";

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

const COLORS = [
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))"
];

const formatPercentage = (value: number) => Number.isFinite(value) ? parseFloat(value.toFixed(1)) : 0;

export function MotivationCharts() {
  const [selectedSector, setSelectedSector] = useState("all");

  const filters = useMemo(
    () => ({
      sector: selectedSector !== "all" ? selectedSector : undefined
    }),
    [selectedSector]
  );

  const { data, loading, error } = useSectionStats("motivation", filters);

  const questions = useMemo(() => {
    return (data ?? []).map((question) => ({
      ...question,
      stats: aggregateRatings(question.ratings)
    }));
  }, [data]);

  const isEmpty = !loading && questions.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[220px] bg-background">
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
          <span className="text-sm text-muted-foreground">
            {selectedSector === "all"
              ? "Mostrando todos os setores"
              : `Filtrado por: ${selectedSector}`}
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-dashed">
              <CardHeader>
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-40 animate-pulse rounded bg-muted" />
                <div className="h-24 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {isEmpty ? (
        <div className="rounded-md border border-dashed border-muted-foreground/30 p-6 text-center text-sm text-muted-foreground">
          Nenhum dado disponível para os filtros selecionados.
        </div>
      ) : null}

      {!loading && !isEmpty ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {questions.map((question, index) => {
            const chartData = [
              {
                name: "Positivo",
                value: formatPercentage(question.stats.positive.percentage),
                count: question.stats.positive.count,
                fill: COLORS[0]
              },
              {
                name: "Neutro",
                value: formatPercentage(question.stats.neutral.percentage),
                count: question.stats.neutral.count,
                fill: COLORS[1]
              },
              {
                name: "Negativo",
                value: formatPercentage(question.stats.negative.percentage),
                count: question.stats.negative.count,
                fill: COLORS[2]
              }
            ];

            return (
              <Card
                key={question.questionId}
                className="group bg-gradient-to-br from-background to-muted/20 border-2 hover:scale-[1.02] hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
                  <CardTitle className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {question.label}
                  </CardTitle>
                  <Badge variant="secondary">
                    {question.stats.totalResponses} respostas
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-5">
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
                          animationBegin={index * 150}
                          animationDuration={900}
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                          }}
                          formatter={(value: number, _name, props) => [
                            `${formatPercentage(value)}% (${props?.payload?.count ?? 0})`,
                            props?.payload?.name ?? ""
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px"
                          }}
                          formatter={(value: number, _key, props) => [
                            `${formatPercentage(value)}% (${props?.payload?.count ?? 0})`,
                            "Percentual"
                          ]}
                        />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1200}
                          animationBegin={index * 120}
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`bar-${idx}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4 text-xs">
                    {question.stats.breakdown.map((item) => (
                      <div key={item.label} className="rounded-lg border bg-muted/30 p-3">
                        <div className="text-sm font-semibold text-foreground">
                          {formatPercentage(item.percentage)}%
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.count} respostas
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
