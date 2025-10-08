# 🗄️ Documentação do Banco de Dados - PAPEM

## 📋 Visão Geral

Sistema de banco de dados PostgreSQL para o **PAPEM - Sistema de Pesquisa de Clima Organizacional** da Marinha do Brasil.

### 🎯 Objetivo
Armazenar e analisar respostas de pesquisas de clima organizacional de forma segura e anônima, permitindo geração de relatórios estatísticos para tomada de decisões.

---

## 🔧 Configuração Técnica

### 📊 **Banco de Dados**
- **SGBD**: PostgreSQL 12+
- **Codificação**: UTF-8
- **Nome**: `papem_clima_organizacional`
- **Host**: localhost
- **Porta**: 5432

### 🔐 **Credenciais**
```
Usuário: postgres
Senha: suasenha123
```

### 🔗 **String de Conexão**
```
postgresql://postgres:suasenha123@localhost:5432/papem_clima_organizacional
```

---

## 📈 Estrutura do Banco

### 🗃️ **Tabela Principal: `survey_responses`**

Armazena todas as respostas da pesquisa de clima organizacional.

#### 📝 **Campos e Descrições**

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `id` | serial | Identificador único da resposta | ✅ |
| `created_at` | timestamp | Data/hora de criação | ✅ |
| `ip_address` | varchar(45) | IP do respondente (controle duplicação) | ✅ |

#### 🏢 **Seção 1: Condições de Trabalho, Serviço e TFM**

| Campo | Tipo | Descrição | Seção |
|-------|------|-----------|-------|
| `setor_trabalho` | varchar(100) | Área principal de trabalho | Trabalho |
| `materiais_fornecidos` | varchar(50) | Materiais fornecidos adequadamente | Trabalho |
| `materiais_adequados` | varchar(50) | Materiais em boas condições | Trabalho |
| `atendimento_apoio` | varchar(50) | Qualidade do atendimento de apoio | Trabalho |
| `ambiente_trabalho` | varchar(50) | Ambiente de trabalho adequado | Trabalho |
| `chefia_disponivel` | varchar(50) | Disponibilidade da chefia | Trabalho |
| `chefia_orientacao` | varchar(50) | Qualidade das orientações da chefia | Trabalho |

#### 🏠 **Alojamento (Condicional)**

| Campo | Tipo | Descrição | Condição |
|-------|------|-----------|----------|
| `localizacao_alojamento` | varchar(100) | Local do alojamento | Opcional |
| `alojamento_condicoes` | varchar(50) | Condições do alojamento | Se localização informada |
| `banheiros_adequados` | varchar(50) | Adequação dos banheiros | Se localização informada |

#### 🍽️ **Rancho (Obrigatório)**

| Campo | Tipo | Descrição | Condição |
|-------|------|-----------|----------|
| `localizacao_rancho` | varchar(100) | Local do rancho | Sempre obrigatório |
| `praca_darmas_adequada` | varchar(50) | Adequação da Praça D'armas | Só se rancho = "Praça D'armas" |
| `rancho_instalacoes` | varchar(50) | Adequação das instalações | Sempre obrigatório |
| `rancho_qualidade` | varchar(50) | Qualidade da comida | Sempre obrigatório |

#### ⚓ **Escala de Serviço (Obrigatório)**

| Campo | Tipo | Descrição | Condição |
|-------|------|-----------|----------|
| `escala_servico` | varchar(100) | Tipo de escala | Sempre obrigatório |
| `escala_atrapalha` | varchar(50) | Se escala atrapalha trabalho | Se escala informada |
| `equipamentos_servico` | varchar(50) | Equipamentos em bom estado | Se escala informada |
| `tfm_participa` | varchar(50) | Participação no TFM | Se escala informada |
| `tfm_incentivado` | varchar(50) | Incentivo ao TFM | Se escala informada |
| `tfm_instalacoes` | varchar(50) | Adequação instalações TFM | Se escala informada |

#### 👥 **Seção 2: Relacionamentos**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `pares_auxiliam` | varchar(50) | Pares auxiliam quando necessário |
| `pares_cooperacao` | varchar(50) | Cooperação entre pares |
| `subordinados_orientacao` | varchar(50) | Orientação aos subordinados |
| `subordinados_disponibilidade` | varchar(50) | Disponibilidade para subordinados |
| `chefia_dialogo` | varchar(50) | Diálogo com a chefia |
| `chefia_orientacao_relacionamento` | varchar(50) | Orientação da chefia nos relacionamentos |
| `chefia_disponibilidade` | varchar(50) | Disponibilidade da chefia |
| `chefia_competencia` | varchar(50) | Competência da chefia |
| `comunicacao_eficaz` | varchar(50) | Eficácia da comunicação |
| `informacoes_claras` | varchar(50) | Clareza das informações |

#### 🚀 **Seção 3: Motivação e Desenvolvimento**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `reconhecimento_trabalho` | varchar(50) | Reconhecimento do trabalho |
| `oportunidades_crescimento` | varchar(50) | Oportunidades de crescimento |
| `cursos_capacitacao` | varchar(50) | Disponibilidade de cursos |
| `atualizacao_conhecimentos` | varchar(50) | Atualização de conhecimentos |
| `satisfacao_geral` | varchar(50) | Satisfação geral |
| `recomendar_organizacao` | varchar(50) | Recomendaria a organização |

#### 💬 **Seção 4: Comentários**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `comentarios_gerais` | text | Comentários gerais (opcional) |
| `sugestoes_melhorias` | text | Sugestões de melhorias (opcional) |

### 📊 **Tabela de Estatísticas: `survey_stats`**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | Identificador único |
| `total_responses` | integer | Total de respostas |
| `last_updated` | timestamp | Última atualização |

---

## 🎭 **Valores das Respostas Likert**

Todas as questões de escala Likert utilizam os seguintes valores:

- **"Concordo totalmente"**
- **"Concordo"**
- **"Discordo"**
- **"Discordo totalmente"**

---

## 🔐 **Segurança e Privacidade**

### 🔒 **Anonimato Garantido**
- ✅ Nenhum dado pessoal é armazenado
- ✅ IP usado apenas para controle de duplicação
- ✅ Não há rastreamento de usuários individuais

### 🛡️ **Controles de Integridade**
- ✅ Validação de dados obrigatórios
- ✅ Prevenção de respostas duplicadas por IP
- ✅ Validação de tipos de dados

---

## 🔄 **Relacionamentos e Regras de Negócio**

### 📋 **Regras Condicionais**

1. **Alojamento (Q8-Q10)**:
   - Se `localizacao_alojamento` informado → Q9-Q10 obrigatórias

2. **Rancho (Q11-Q14)**:
   - `localizacao_rancho` sempre obrigatório
   - Se `localizacao_rancho = "Praça D'armas"` → Q12 obrigatória
   - Q13-Q14 sempre obrigatórias quando rancho informado

3. **Escala (Q15-Q20)**:
   - `escala_servico` sempre obrigatório
   - Q16-Q20 obrigatórias quando escala informada

### 🎯 **Numeração Dinâmica**
A numeração das questões se adapta baseada nas respostas:
- Sem Praça D'armas: Q11 → Q12 → Q13 → Q14 → Q15 → Q16 → Q17 → Q18 → Q19
- Com Praça D'armas: Q11 → Q12 → Q13 → Q14 → Q15 → Q16 → Q17 → Q18 → Q19 → Q20

---

## 📊 **Índices e Performance**

### 🚀 **Índices Recomendados**
```sql
-- Índice para consultas por setor
CREATE INDEX idx_survey_setor ON survey_responses(setor_trabalho);

-- Índice para consultas por rancho
CREATE INDEX idx_survey_rancho ON survey_responses(localizacao_rancho);

-- Índice para consultas por escala
CREATE INDEX idx_survey_escala ON survey_responses(escala_servico);

-- Índice para consultas temporais
CREATE INDEX idx_survey_created ON survey_responses(created_at);

-- Índice para controle de duplicação
CREATE INDEX idx_survey_ip ON survey_responses(ip_address);
```

---

## 🔧 **Scripts de Manutenção**

### 🧹 **Limpeza de Dados Teste**
```sql
-- Remover dados de teste
DELETE FROM survey_responses WHERE ip_address = '127.0.0.1';
```

### 📈 **Consultas de Análise**

#### Total de Respostas por Setor
```sql
SELECT setor_trabalho, COUNT(*) as total
FROM survey_responses 
WHERE setor_trabalho IS NOT NULL
GROUP BY setor_trabalho
ORDER BY total DESC;
```

#### Satisfação Geral por Escala
```sql
SELECT escala_servico, satisfacao_geral, COUNT(*) as total
FROM survey_responses 
WHERE escala_servico IS NOT NULL AND satisfacao_geral IS NOT NULL
GROUP BY escala_servico, satisfacao_geral
ORDER BY escala_servico, total DESC;
```

#### Respostas por Período
```sql
SELECT DATE(created_at) as data, COUNT(*) as respostas
FROM survey_responses
GROUP BY DATE(created_at)
ORDER BY data DESC;
```

---

## 🆘 **Backup e Recuperação**

### 💾 **Backup Completo**
```bash
pg_dump -h localhost -U postgres -d papem_clima_organizacional > backup_papem_$(date +%Y%m%d_%H%M%S).sql
```

### 🔄 **Restauração**
```bash
psql -h localhost -U postgres -d papem_clima_organizacional < backup_papem_YYYYMMDD_HHMMSS.sql
```

---

## 📞 **Suporte Técnico**

### 🔍 **Troubleshooting Comum**

1. **Erro de Conexão**:
   ```bash
   # Verificar se PostgreSQL está rodando
   sudo systemctl status postgresql
   
   # Iniciar se necessário
   sudo systemctl start postgresql
   ```

2. **Erro de Permissão**:
   ```sql
   -- Dar permissões ao usuário
   GRANT ALL PRIVILEGES ON DATABASE papem_clima_organizacional TO postgres;
   ```

3. **Verificar Espaço em Disco**:
   ```sql
   SELECT pg_size_pretty(pg_database_size('papem_clima_organizacional'));
   ```

---

*Documentação gerada automaticamente pelo Sistema PAPEM - $(date +%Y-%m-%d)*