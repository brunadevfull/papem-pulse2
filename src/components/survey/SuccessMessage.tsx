import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Sparkles, Star, Anchor, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SuccessMessage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <Card className="bg-gradient-hero text-primary-foreground shadow-naval overflow-hidden relative border-0">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-gradient bg-[length:400%_400%]"></div>
        
        <CardHeader className="text-center relative z-10 py-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-24 bg-gradient-glass rounded-full flex items-center justify-center backdrop-blur-sm shadow-neon animate-float border border-white/20">
              <CheckCircle2 className="w-12 h-12 animate-pulse-slow text-success" />
            </div>
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm animate-float">
              <Anchor className="w-10 h-10 animate-glow" />
            </div>
          </div>
          
          <CardTitle className="text-5xl font-bold mb-6 animate-scale-in">
            Pesquisa Enviada com Sucesso!
          </CardTitle>
          
          <CardDescription className="text-primary-foreground/90 text-2xl leading-relaxed max-w-2xl mx-auto font-medium">
            Obrigado por sua participação! Suas respostas foram registradas de forma 
            <span className="font-bold text-naval-gold animate-pulse-slow"> totalmente anônima</span>.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-glass backdrop-blur-sm shadow-custom-xl border-0">
        <CardContent className="pt-8 text-center">
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-8 py-4 text-lg font-bold bg-gradient-primary hover:scale-105 shadow-glow transition-all duration-300 rounded-2xl"
            >
              <Home className="w-6 h-6" />
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}