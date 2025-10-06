import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStats, ratingToPercentage } from "@/hooks/useStats";
import { ClipboardList, BarChart3, Shield, Users, Target, ArrowRight, Sparkles, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useStats();

  const features = [
    {
      icon: Shield,
      title: "Pesquisa Anônima",
      description: "Complete anonimato garantido em todas as respostas coletadas",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20"
    },
    {
      icon: Users,
      title: "Análise Segmentada", 
      description: "Resultados organizados por setor, função e outras dimensões",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      icon: Target,
      title: "Insights Acionáveis",
      description: "Recomendações práticas baseadas nos dados coletados",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    }
  ];

  const sectionsWithResponses = stats
    ? Object.values(stats.satisfactionStats || {}).filter((ratings) => ratings && ratings.length > 0)
    : [];

  const sectionsAnswered = sectionsWithResponses.length;

  const satisfactionPercentage = sectionsAnswered
    ? Math.round(
        sectionsWithResponses.reduce(
          (sum, ratings) => sum + ratingToPercentage(ratings).concordo,
          0
        ) / sectionsAnswered
      )
    : 0;

  const formattedLastUpdated = stats?.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
      })
    : "Sem registro";

  const heroStats = stats
    ? [
        {
          icon: Users,
          value: stats.totalResponses.toLocaleString("pt-BR"),
          label: "Respostas Coletadas",
          color: "text-success"
        },
        {
          icon: ClipboardList,
          value: sectionsAnswered.toString(),
          label: "Seções Respondidas",
          color: "text-warning"
        },
        {
          icon: TrendingUp,
          value: `${satisfactionPercentage}%`,
          label: "Satisfação Positiva",
          color: "text-primary"
        },
        {
          icon: Clock,
          value: formattedLastUpdated,
          label: "Última atualização",
          color: "text-accent"
        }
      ]
    : [];

  const placeholderStats = Array.from({ length: 4 });

  return (
    <div className="space-y-12 animate-slide-up">
      {/* Hero Section */}
      <Card className="bg-gradient-hero text-primary-foreground shadow-neon overflow-hidden relative border-0">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-gradient bg-[length:400%_400%]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary animate-shimmer overflow-hidden">
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        </div>
        
        <CardHeader className="pb-8 relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-glass rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-neon animate-float border border-white/20">
              <ClipboardList className="w-10 h-10 animate-pulse-slow" />
            </div>
            <div>
              <CardTitle className="text-4xl mb-3 font-bold">
                Sistema PAPEM
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 text-xl font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-glow" />
                Pesquisa de Clima Organizacional
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed font-medium">
            Bem-vindo ao sistema de pesquisa de clima organizacional da PAPEM. 
            Nossa plataforma permite a coleta e análise de feedback anônimo para 
            melhorar continuamente o ambiente de trabalho.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {loading &&
              placeholderStats.map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-pulse"
                >
                  <div className="w-6 h-6 mx-auto mb-4 bg-white/20 rounded-full"></div>
                  <div className="h-6 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded"></div>
                </div>
              ))}

            {!loading && error && (
              <div className="col-span-2 md:col-span-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-sm text-red-100 font-medium">Erro ao carregar estatísticas: {error}</p>
                <p className="text-xs text-primary-foreground/70 mt-2">Tente novamente em instantes.</p>
              </div>
            )}

            {!loading && !error && stats &&
              heroStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <IconComponent
                      className={`w-6 h-6 mx-auto mb-2 ${stat.color} animate-float`}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                  </div>
                );
              })}

            {!loading && !error && !stats && (
              <div className="col-span-2 md:col-span-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-sm text-primary-foreground/90 font-medium">
                  Nenhum dado disponível no momento.
                </p>
                <p className="text-xs text-primary-foreground/70 mt-2">
                  Participe da pesquisa para gerar estatísticas atualizadas.
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate("/survey")}
              className="bg-white text-primary hover:bg-white/90 flex items-center gap-3 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-neon transition-all duration-300 hover:scale-105 rounded-2xl"
            >
              <ClipboardList className="w-6 h-6" />
              Participar da Pesquisa
              <ArrowRight className="w-5 h-5 animate-pulse-slow" />
            </Button>
            
            <Button 
              onClick={() => navigate("/admin")}
              variant="outline" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 flex items-center gap-3 px-8 py-4 text-lg font-semibold backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="w-6 h-6" />
              Ver Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="bg-gradient-card shadow-custom-xl hover:shadow-neon transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden border-0 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm"></div>
              <div className="absolute inset-0.5 bg-gradient-card rounded-2xl"></div>
              
              <CardHeader className="relative z-10">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300 border ${feature.borderColor}`}>
                  <IconComponent className={`w-8 h-8 ${feature.color} animate-float`} style={{ animationDelay: `${index * 0.3}s` }} />
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Information Cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-gradient-card shadow-custom-xl hover:shadow-neon transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border-0">
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-primary animate-pulse-slow" />
              </div>
              Como Funciona a Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="space-y-5">
              <div className="flex gap-4 group/item">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                  <span className="text-sm font-bold text-primary-foreground">1</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base group-hover/item:text-primary transition-colors">Seção 1: Ambiente de Trabalho</h4>
                  <p className="text-sm text-muted-foreground">Condições físicas, recursos e TFM</p>
                </div>
              </div>
              <div className="flex gap-4 group/item">
                <div className="w-10 h-10 bg-gradient-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                  <span className="text-sm font-bold text-accent-foreground">2</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base group-hover/item:text-accent transition-colors">Seção 2: Relacionamento</h4>
                  <p className="text-sm text-muted-foreground">Liderança, equipe e comunicação</p>
                </div>
              </div>
              <div className="flex gap-4 group/item">
                <div className="w-10 h-10 bg-success/90 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                  <span className="text-sm font-bold text-success-foreground">3</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-base group-hover/item:text-success transition-colors">Seção 3: Motivação</h4>
                  <p className="text-sm text-muted-foreground">Desenvolvimento e reconhecimento</p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Tempo estimado:</strong> 10-15 minutos para completar
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-custom-xl hover:shadow-neon transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border-0">
          <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-success/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-success animate-glow" />
              </div>
              Garantia de Anonimato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="bg-gradient-glass border border-success/30 p-6 rounded-2xl backdrop-blur-sm shadow-glow">
              <p className="text-sm text-success-foreground flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5 animate-pulse-slow" />
                <span>
                  <strong className="text-base">100% Anônimo:</strong> Nenhuma informação pessoal é coletada ou associada às suas respostas.
                </span>
              </p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 group/item">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                <span className="group-hover/item:text-foreground transition-colors">Não solicitamos nome, matrícula ou qualquer identificação</span>
              </div>
              <div className="flex items-start gap-3 group/item">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="group-hover/item:text-foreground transition-colors">Dados agregados utilizados apenas para análises estatísticas</span>
              </div>
              <div className="flex items-start gap-3 group/item">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="group-hover/item:text-foreground transition-colors">Respostas individuais não são rastreáveis</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
