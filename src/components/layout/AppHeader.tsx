import { Sparkles, Shield, BarChart3, ClipboardList } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const location = useLocation();
  
  return (
    <header className="h-20 border-b bg-gradient-card shadow-custom-lg relative overflow-hidden backdrop-blur-sm">
      {/* Background mesh pattern */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-glass backdrop-blur-xs"></div>
      
      <div className="relative z-10 h-full flex items-center px-8 gap-6">
        <div className="flex-1 flex items-center gap-4">
          {/* Brasão PAPEM */}
          <div className="relative">
            <img 
              src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
              alt="Brasão PAPEM" 
              className="w-12 h-12 object-contain"
            />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              PAPEM - Pagadoria de Pessoal da Marinha
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-success animate-pulse-slow" />
                100% Anônimo
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={location.pathname === "/" || location.pathname === "/survey" ? "default" : "ghost"}
            size="sm"
            className="gap-2"
          >
            <NavLink to="/survey">
              <ClipboardList className="w-4 h-4" />
              Pesquisa
            </NavLink>
          </Button>
          
          <Button
            asChild
            variant={location.pathname === "/admin" ? "default" : "ghost"}
            size="sm" 
            className="gap-2"
          >
            <NavLink to="/admin">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </NavLink>
          </Button>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-success font-medium">Sistema Ativo</span>
        </div>
      </div>
    </header>
  );
}