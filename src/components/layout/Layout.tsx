import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Pesquisa de Clima",
    url: createPageUrl("Survey"),
    icon: ClipboardList,
    pageName: "Survey"
  },
  {
    title: "Dashboard Administrativo", 
    url: createPageUrl("Admin"),
    icon: BarChart3,
    pageName: "Admin"
  }
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <header className="bg-gradient-card shadow-custom-lg relative overflow-hidden backdrop-blur-sm border-b">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-glass backdrop-blur-xs"></div>
        
        <div className="relative z-10 h-20 flex items-center px-8 gap-6">
          <div className="flex-1 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon animate-float">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PAPEM - Pagadoria de Pessoal da Marinha
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Pesquisa de Clima Organizacional
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.title}
                asChild
                variant={currentPageName === item.pageName ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Link to={item.url}>
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          PAPEM - Pagadoria de Pessoal da Marinha
        </p>
      </footer>
    </div>
  );
}