# 🚢 PAPEM - Sistema de Pesquisa de Clima Organizacional

## 📋 Visão Geral

**PAPEM** é um sistema web moderno para condução de pesquisas de clima organizacional na **Marinha do Brasil**. Desenvolvido com foco em **anonimato total**, **interface intuitiva** e **análises estatísticas avançadas**.

### 🎯 Objetivos
- ✅ **Anonimato Garantido**: Respostas 100% anônimas sem rastreamento pessoal
- ✅ **Interface Moderna**: Design responsivo e intuitivo para todos os dispositivos
- ✅ **Análises Avançadas**: Dashboard com visualizações e estatísticas em tempo real
- ✅ **Flexibilidade**: Questionário adaptativo baseado nas respostas do usuário

---

## 🛠️ Tecnologias Utilizadas

### 🎨 **Frontend**
- **React 18** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática e maior segurança
- **Vite** - Build tool moderno e rápido
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **Radix UI** - Primitivos acessíveis para componentes
- **React Router DOM** - Roteamento client-side
- **React Query (TanStack)** - Gerenciamento de estado do servidor
- **React Hook Form** - Formulários performáticos com validação
- **Zod** - Validação e schema de dados
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos

### 🖥️ **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM TypeScript-first
- **pg** - Driver PostgreSQL para Node.js

### 🔧 **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **TypeScript** - Tipagem estática
- **tsx** - Executor TypeScript para Node.js
- **Drizzle Kit** - Ferramentas de migration e introspection

---

## 📁 Estrutura do Projeto

```
papem-clima-organizacional/
├── 📁 src/                          # Código fonte do frontend
│   ├── 📁 components/               # Componentes React
│   │   ├── 📁 admin/                # Componentes do dashboard admin
│   │   │   ├── DetailedAnalysis.tsx
│   │   │   ├── EnvironmentCharts.tsx
│   │   │   ├── MotivationCharts.tsx
│   │   │   ├── RelationshipCharts.tsx
│   │   │   └── StatsOverview.tsx
│   │   ├── 📁 layout/               # Componentes de layout
│   │   │   └── AppHeader.tsx
│   │   ├── 📁 survey/               # Componentes da pesquisa
│   │   │   ├── SurveySection1.tsx   # Trabalho, Serviço, TFM
│   │   │   ├── SurveySection2.tsx   # Relacionamentos
│   │   │   ├── SurveySection3.tsx   # Motivação e Desenvolvimento
│   │   │   ├── SurveySection4.tsx   # Comentários
│   │   │   ├── SuccessMessage.tsx   # Mensagem de sucesso
│   │   │   ├── Question.tsx         # Componente de questão
│   │   │   └── SelectQuestion.tsx   # Questão de seleção
│   │   └── 📁 ui/                   # Componentes UI reutilizáveis
│   ├── 📁 hooks/                    # Hooks personalizados
│   ├── 📁 lib/                      # Utilitários e configurações
│   ├── 📁 pages/                    # Páginas da aplicação
│   │   ├── Admin.tsx                # Dashboard administrativo
│   │   ├── Survey.tsx               # Página da pesquisa
│   │   └── Home.tsx                 # Página inicial
│   └── App.tsx                      # Componente raiz
├── 📁 shared/                       # Código compartilhado
│   └── schema.ts                    # Schema do banco de dados
├── 📁 server/                       # Código do servidor
│   ├── db.ts                        # Configuração do banco
│   ├── storage.ts                   # Interface de armazenamento
│   └── vite.ts                      # Servidor de desenvolvimento
├── 📁 drizzle/                      # Migrations do banco
├── setup-database.sh               # Script de configuração do banco
├── drizzle.config.ts               # Configuração do Drizzle ORM
└── package.json                    # Dependências e scripts
```

---

## 🎭 Funcionalidades Principais

### 📝 **Sistema de Pesquisa**

#### **Seção 1: Condições de Trabalho, Serviço e TFM**
- ✅ **Q1-Q7**: Questões gerais sobre trabalho e chefia
- ✅ **Q8-Q10**: Alojamento (condicional - baseado na localização)
- ✅ **Q11-Q14**: Rancho (obrigatório, com Q12 condicional para Praça D'armas)
- ✅ **Q15-Q20**: Escala de serviço e TFM (condicional)

#### **Seção 2: Relacionamentos**
- ✅ **10 questões** sobre relacionamentos interpessoais
- ✅ Avaliação de pares, subordinados e chefia
- ✅ Comunicação e clareza de informações

#### **Seção 3: Motivação e Desenvolvimento Profissional**
- ✅ **6 questões** sobre motivação e crescimento
- ✅ Reconhecimento, oportunidades e capacitação
- ✅ Satisfação geral e recomendação da organização

#### **Seção 4: Comentários e Sugestões**
- ✅ **Campos opcionais** para feedback textual
- ✅ Comentários gerais e sugestões de melhorias

### 🎯 **Características Especiais**

#### **Numeração Dinâmica**
O sistema adapta a numeração das questões baseado nas respostas:
- **Sem Praça D'armas**: Q11 → Q12 → Q13 → ... → Q19
- **Com Praça D'armas**: Q11 → Q12 → Q13 → Q14 → ... → Q20

#### **Validação Inteligente**
- ✅ Questões obrigatórias marcadas claramente
- ✅ Validação condicional baseada em respostas anteriores
- ✅ Limpeza automática de campos irrelevantes

#### **Controle de Duplicação**
- ✅ Prevenção de múltiplas respostas pelo mesmo IP
- ✅ Manutenção do anonimato com controle técnico

### 📊 **Dashboard Administrativo**

#### **Visão Geral**
- ✅ **Cards estatísticos** com total de respostas
- ✅ **Distribuição por setor** em formato compacto
- ✅ **Últimas respostas** em tempo real

#### **Análises Detalhadas**

**📈 Condições de Trabalho e Ambiente**
- ✅ Gráficos de barras para questões de trabalho
- ✅ Análise de materiais, equipamentos e apoio
- ✅ Distribuição por localização (rancho/escala)

**👥 Relacionamentos**
- ✅ Visualização de relacionamentos interpessoais
- ✅ Análise de comunicação e chefia
- ✅ Gráficos de satisfação por categoria

**🚀 Motivação e Desenvolvimento**
- ✅ Métricas de satisfação e reconhecimento
- ✅ Análise de oportunidades de crescimento
- ✅ Recomendação da organização

#### **Filtros Avançados**
- ✅ **Setor**: Filtro global aplicado a todas as seções
- ✅ **Alojamento**: Afeta questões Q9-Q10
- ✅ **Rancho**: Afeta questões Q11-Q14
- ✅ **Escala**: Afeta questões Q16-Q20

---

## 🎨 Design e UX

### 🌈 **Tema Visual**
- ✅ **Gradientes navais** com cores da Marinha
- ✅ **Elementos de vidro** com backdrop-blur
- ✅ **Animações suaves** para melhor experiência
- ✅ **Ícones temáticos** (âncora, escudo, etc.)

### 📱 **Responsividade**
- ✅ **Mobile-first** design approach
- ✅ **Layout adaptativo** para tablets e desktops
- ✅ **Touch-friendly** interfaces

### ♿ **Acessibilidade**
- ✅ **Componentes Radix UI** com padrões ARIA
- ✅ **Contraste adequado** para legibilidade
- ✅ **Navegação por teclado** suportada
- ✅ **Screen readers** compatível

---

## 🔧 Configuração e Instalação

### 📋 **Pré-requisitos**
- **Node.js** 18+ 
- **PostgreSQL** 12+
- **npm** ou **yarn**

### 🚀 **Instalação Rápida**

1. **Clone ou baixe o projeto**
2. **Instale dependências**:
   ```bash
   npm install
   ```
3. **Configure o banco**:
   ```bash
   npm run setup:db
   ```
4. **Inicie a aplicação**:
   ```bash
   npm run dev
   ```

### 🗄️ **Scripts Disponíveis**

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Inicia servidor de produção |
| `npm run setup:db` | Configura banco PostgreSQL |
| `npm run db:push` | Sincroniza schema com banco |
| `npm run db:studio` | Abre Drizzle Studio |
| `npm run lint` | Executa linting do código |

---

## 🔐 Segurança e Privacidade

### 🛡️ **Proteções Implementadas**

#### **Anonimato Total**
- ✅ **Nenhum dado pessoal** é coletado ou armazenado
- ✅ **IP usado apenas** para controle de duplicação
- ✅ **Sem cookies** de rastreamento
- ✅ **Sem identificadores** únicos persistentes

#### **Validação de Dados**
- ✅ **Sanitização de inputs** no frontend e backend
- ✅ **Validação TypeScript** em tempo de compilação
- ✅ **Schemas Zod** para validação runtime
- ✅ **Prevenção de SQL Injection** via ORM

#### **Controle de Acesso**
- ✅ **Dashboard público** (sem autenticação por design)
- ✅ **Dados agregados** apenas - sem dados individuais
- ✅ **Rate limiting** pode ser implementado se necessário

---

## 📊 Análises e Relatórios

### 📈 **Métricas Disponíveis**

#### **Estatísticas Gerais**
- Total de respostas
- Distribuição temporal
- Cobertura por setor/escala/rancho

#### **Análises Likert**
- Distribuição de respostas por escala
- Médias ponderadas por categoria
- Comparação entre grupos

#### **Análises Textuais**
- Comentários categorizados
- Sugestões compiladas
- Feedback qualitativo

### 📋 **Relatórios Exportáveis**
*A implementar*:
- ✏️ Export para PDF
- ✏️ Export para Excel/CSV
- ✏️ Relatórios agendados
- ✏️ Análises comparativas temporais

---

## 🚀 Deploy e Produção

### 🌐 **Configuração para Produção**

#### **Variáveis de Ambiente**
```bash
# Banco de Dados
DATABASE_URL=postgresql://postgres:suasenha123@localhost:5432/papem_clima_organizacional

# Aplicação
NODE_ENV=production
PORT=5000
```

#### **Build de Produção**
```bash
npm run build
npm run start
```

### 📦 **Docker (Opcional)**
*Configuração Docker pode ser implementada*:
- ✏️ Dockerfile para aplicação
- ✏️ docker-compose.yml com PostgreSQL
- ✏️ Scripts de deploy automatizado

---

## 🔄 Manutenção e Monitoramento

### 📊 **Logs e Monitoramento**
- ✅ **Console logs** estruturados
- ✅ **Error tracking** no frontend
- ✏️ **Metrics collection** (a implementar)
- ✏️ **Health checks** (a implementar)

### 🧹 **Rotinas de Manutenção**

#### **Limpeza de Dados**
```sql
-- Remover dados de teste
DELETE FROM survey_responses WHERE ip_address = '127.0.0.1';
```

#### **Backup Automático**
```bash
# Backup diário (crontab)
0 2 * * * pg_dump -h localhost -U postgres papem_clima_organizacional > /backup/papem_$(date +\%Y\%m\%d).sql
```

---

## 📚 Extensibilidade

### 🔧 **Customizações Possíveis**

#### **Questionário**
- ✅ Adicionar/remover seções facilmente
- ✅ Modificar questões via schema
- ✅ Implementar lógica condicional complexa

#### **Dashboard**
- ✅ Novos tipos de gráfico
- ✅ Filtros personalizados
- ✅ Visualizações específicas por setor

#### **Integrações**
- ✏️ API REST para sistemas externos
- ✏️ Export automático para sistemas HR
- ✏️ Notificações automáticas

---

## 🆘 Suporte e Troubleshooting

### 🔍 **Problemas Comuns**

#### **Erro de Conexão com Banco**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar credenciais no drizzle.config.ts
```

#### **Erro de Build/Compilação**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### **Problemas de Performance**
```sql
-- Verificar índices do banco
\d+ survey_responses

-- Analisar queries lentas
EXPLAIN ANALYZE SELECT * FROM survey_responses;
```

### 📞 **Contato para Suporte**
- 📧 **Email**: [configurar email de suporte]
- 📋 **Issues**: [configurar sistema de tickets]
- 📚 **Documentação**: Este arquivo e README_BANCO_DADOS.md

---

## 📋 Roadmap Futuro

### 🎯 **Próximas Funcionalidades**
- ✏️ **Sistema de autenticação** para admins
- ✏️ **Múltiplas pesquisas** simultâneas
- ✏️ **Comparação temporal** de resultados
- ✏️ **Alertas automáticos** para métricas críticas
- ✏️ **API móvel** para aplicativo dedicado
- ✏️ **IA para análise** de comentários textuais

### 🔧 **Melhorias Técnicas**
- ✏️ **Testes automatizados** (Jest/Cypress)
- ✏️ **CI/CD pipeline** completo
- ✏️ **Monitoramento avançado** (Prometheus/Grafana)
- ✏️ **Cache Redis** para performance
- ✏️ **CDN** para assets estáticos

---

*Documentação atualizada em $(date +%Y-%m-%d) - Sistema PAPEM v1.0*