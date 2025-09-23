import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          PAPEM - Pagadoria de Pessoal da Marinha
        </p>
      </footer>
    </div>
  );
}