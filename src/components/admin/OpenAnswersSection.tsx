import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Lightbulb, Heart, AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useOpenComments } from "@/hooks/useOpenComments";

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

const categories = [
  {
    title: "Aspectos Positivos",
    icon: ThumbsUp,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    field: "aspecto_positivo" as const,
    emptyMessage: "Nenhum aspecto positivo registrado.",
  },
  {
    title: "Aspectos Negativos",
    icon: ThumbsDown,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    field: "aspecto_negativo" as const,
    emptyMessage: "Nenhum ponto crítico foi reportado.",
  },
  {
    title: "Propostas de Processos",
    icon: Lightbulb,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    field: "proposta_processo" as const,
    emptyMessage: "Nenhuma sugestão de processo informada.",
  },
  {
    title: "Propostas de Satisfação",
    icon: Heart,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    field: "proposta_satisfacao" as const,
    emptyMessage: "Nenhuma proposta de satisfação registrada.",
  },
];

export function OpenAnswersSection() {
  const [selectedSector, setSelectedSector] = useState("all");
  const filters = useMemo(() => (
    selectedSector !== "all" ? { setor: selectedSector } : {}
  ), [selectedSector]);

  const { comments, loading, error } = useOpenComments(filters);

  const formatDate = (value: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
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

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando comentários...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="text-center space-y-2 mb-8">
        <h3 className="text-2xl font-bold text-foreground">Respostas Abertas</h3>
        <p className="text-muted-foreground">
          {comments.length > 0
            ? `Exibindo ${comments.length} registros qualitativos`
            : "Nenhuma resposta aberta encontrada para os filtros selecionados."}
        </p>
      </div>

      {categories.map((category) => {
        const Icon = category.icon;
        const entries = comments.filter((comment) => {
          const content = comment[category.field];
          return content && content.trim().length > 0;
        });

        return (
          <Card key={category.field} className="survey-card">
            <CardHeader className={`${category.bgColor} ${category.borderColor} border-b`}>
              <CardTitle className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${category.color}`} />
                {category.title}
                <Badge variant="secondary" className="ml-auto">
                  {entries.length} respostas
                </Badge>
              </CardTitle>
              <CardDescription>
                {`Comentários relacionados a ${category.title.toLowerCase()}.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-6 space-y-4">
                  {entries.length === 0 && (
                    <p className="text-sm text-muted-foreground">{category.emptyMessage}</p>
                  )}
                  {entries.map((answer, index) => (
                    <div key={`${answer.id}-${category.field}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <MessageSquare className="w-4 h-4" />
                          <span>Resposta #{answer.id}</span>
                          {answer.setor_localizacao && (
                            <Badge variant="outline" className="text-xs">
                              {answer.setor_localizacao}
                            </Badge>
                          )}
                          {answer.created_at && (
                            <span className="text-xs">{formatDate(answer.created_at)}</span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-foreground bg-muted/30 p-4 rounded-lg whitespace-pre-line">
                          {answer[category.field]}
                        </p>
                      </div>
                      {index < entries.length - 1 && <Separator className="mt-4" />}
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
