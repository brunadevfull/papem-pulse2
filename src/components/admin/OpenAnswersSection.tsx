import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { MessageSquare, ThumbsUp, ThumbsDown, Lightbulb, Heart, Loader2, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useOpenComments, CommentCategoryField } from "@/hooks/useOpenComments";

const STATIC_SECTORS = [
  "PAPEM-10",
  "PAPEM-20",
  "PAPEM-30",
  "PAPEM-40",
  "PAPEM-51",
  "PAPEM-52",
  "SECOM"
];

interface CategoryConfig {
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  field: CommentCategoryField;
  emptyMessage: string;
}

export function OpenAnswersSection() {
  const [selectedSector, setSelectedSector] = useState("all");

  const {
    comments,
    total,
    sectors,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useOpenComments({
    sector: selectedSector !== "all" ? selectedSector : undefined,
    enabled: false
  });

  useEffect(() => {
    refetch();
  }, [selectedSector, refetch]);

  const sectorOptions = useMemo(() => {
    const mergedSectors = [...STATIC_SECTORS];

    sectors
      .filter((sectorOption) => sectorOption && !mergedSectors.includes(sectorOption))
      .forEach((sectorOption) => {
        mergedSectors.push(sectorOption);
      });

    return [
      { value: "all", label: "Todos os setores" },
      ...mergedSectors.map((sectorValue) => ({ value: sectorValue, label: sectorValue }))
    ];
  }, [sectors]);

  const categories: CategoryConfig[] = [
    {
      title: "Aspectos Positivos",
      icon: ThumbsUp,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      field: "aspecto_positivo",
      emptyMessage: "Nenhum comentário positivo encontrado para o filtro selecionado."
    },
    {
      title: "Aspectos Negativos",
      icon: ThumbsDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
      field: "aspecto_negativo",
      emptyMessage: "Nenhum apontamento negativo disponível para este filtro."
    },
    {
      title: "Propostas de Processos",
      icon: Lightbulb,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
      field: "proposta_processo",
      emptyMessage: "Nenhuma proposta de processo cadastrada para o filtro atual."
    },
    {
      title: "Propostas de Satisfação",
      icon: Heart,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      field: "proposta_satisfacao",
      emptyMessage: "Sem propostas de satisfação correspondentes ao filtro."
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
          Análise qualitativa das sugestões e comentários da tripulação ({total} resposta{total === 1 ? "" : "s"}{selectedSector !== "all" ? ` - ${selectedSector}` : ""})
        </p>
      </div>

      {isError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4" />
          <span>{error?.message ?? "Erro ao carregar comentários."}</span>
        </div>
      )}

      {(isLoading || (isFetching && comments.length === 0)) && (
        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando comentários mais recentes...
        </div>
      )}

      {categories.map((category) => {
        const Icon = category.icon;
        const entries = comments
          .map((comment) => ({
            id: comment.id,
            setor: comment.setor,
            value: comment[category.field]
          }))
          .filter((entry) => typeof entry.value === "string" && entry.value.trim().length > 0);

        return (
          <Card key={category.field} className="survey-card">
            <CardHeader className={`${category.bgColor} ${category.borderColor} border-b`}>
              <CardTitle className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${category.color}`} />
                {category.title}
                <Badge variant="secondary" className="ml-auto">
                  {entries.length} resposta{entries.length === 1 ? "" : "s"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Comentários e sugestões sobre {category.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[360px]">
                <div className="p-6 space-y-4">
                  {entries.length === 0 && !isLoading && !isFetching ? (
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                      {category.emptyMessage}
                    </div>
                  ) : (
                    entries.map((entry, index) => (
                      <div key={`${entry.id}-${category.field}`}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="w-4 h-4" />
                            <span>Resposta #{entry.id}</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.setor}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground bg-muted/30 p-4 rounded-lg">
                            {entry.value}
                          </p>
                        </div>
                        {index < entries.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}

    </div>
  );
}