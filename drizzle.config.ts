import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "suasenha123",
    database: "papem_clima_organizacional",
  },
  verbose: true,
  strict: true,
});