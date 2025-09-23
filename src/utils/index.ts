export function createPageUrl(pageName: string): string {
  const pageUrls: Record<string, string> = {
    Survey: "/survey",
    AdminDashboard: "/admin",
    Index: "/",
    Admin: "/admin"
  };
  
  return pageUrls[pageName] || "/";
}