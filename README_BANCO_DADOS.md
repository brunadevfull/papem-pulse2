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

#### 🏢 **Seção 1: Condições do Ambiente de Trabalho / Conforto**

**Setor de trabalho**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `setor_localizacao` | varchar(100) | Localização do setor avaliado |
| `setor_computadores` | varchar(50) | Adequação dos computadores do setor |
| `setor_mobiliario` | varchar(50) | Condições do mobiliário e das instalações |
| `setor_limpeza` | varchar(50) | Limpeza do setor |
| `setor_temperatura` | varchar(50) | Conforto térmico no setor |
| `setor_iluminacao` | varchar(50) | Iluminação do setor |

**Alojamentos**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `alojamento_localizacao` | varchar(100) | Alojamento avaliado |
| `alojamento_limpeza` | varchar(50) | Limpeza do alojamento |
| `alojamento_temperatura` | varchar(50) | Conforto térmico no alojamento |
| `alojamento_iluminacao` | varchar(50) | Iluminação do alojamento |
| `alojamento_armarios_condicao` | varchar(50) | Condições de pintura/preservação dos armários |
| `alojamento_armario_preservado` | varchar(50) | Autoavaliação sobre preservação do armário pessoal |

**Banheiros**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `banheiro_localizacao` | varchar(100) | Banheiro avaliado |
| `banheiro_vasos_suficientes` | varchar(50) | Quantidade de vasos sanitários |
| `banheiro_vasos_preservados` | varchar(50) | Limpeza/preservação dos vasos |
| `banheiro_torneiras_funcionam` | varchar(50) | Funcionamento das torneiras |
| `banheiro_chuveiros_suficientes` | varchar(50) | Quantidade de chuveiros |
| `banheiro_chuveiros_funcionam` | varchar(50) | Funcionamento dos chuveiros |
| `banheiro_limpeza` | varchar(50) | Limpeza geral |
| `banheiro_iluminacao` | varchar(50) | Iluminação |

**Salões de recreio**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `recreio_localizacao` | varchar(100) | Salão de recreio avaliado |
| `recreio_mobiliario_quantidade` | varchar(50) | Quantidade de mobiliário disponível |
| `recreio_mobiliario_condicao` | varchar(50) | Conservação do mobiliário |
| `recreio_limpeza` | varchar(50) | Limpeza do salão |
| `recreio_temperatura` | varchar(50) | Conforto térmico |
| `recreio_iluminacao` | varchar(50) | Iluminação |

**Rancho**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `rancho_localizacao` | varchar(100) | Local do rancho avaliado |
| `rancho_qualidade_comida` | varchar(50) | Qualidade da alimentação |
| `rancho_mobiliario_condicao` | varchar(50) | Condição e limpeza do mobiliário |
| `rancho_limpeza` | varchar(50) | Limpeza geral do rancho |
| `rancho_temperatura` | varchar(50) | Conforto térmico no rancho |
| `rancho_iluminacao` | varchar(50) | Iluminação do rancho |

**Escala de serviço e TFM**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `escala_servico_tipo` | varchar(100) | Escala de serviço do respondente |
| `escala_equipamentos_condicao` | varchar(50) | Condições dos equipamentos utilizados em serviço |
| `escala_pernoite_adequada` | varchar(50) | Adequação das instalações de pernoite |
| `tfm_participa_regularmente` | varchar(50) | Frequência na participação do TFM |
| `tfm_incentivo_pratica` | varchar(50) | Incentivo institucional ao TFM |
| `tfm_instalacoes_adequadas` | varchar(50) | Adequação das instalações para o TFM |

#### 👥 **Seção 2: Relacionamento**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `encarregado_ouve_melhorias` | varchar(50) | Encarregado escuta propostas de melhoria |
| `encarregado_fornece_meios` | varchar(50) | Encarregado disponibiliza recursos necessários |
| `disposicao_contribuir_setor` | varchar(50) | Interesse pessoal em contribuir com o setor |
| `encarregado_delega` | varchar(50) | Capacidade do encarregado em delegar responsabilidades |
| `pares_auxiliam_setor` | varchar(50) | Apoio dos pares na resolução de problemas |
| `relacionamento_intersetorial` | varchar(50) | Qualidade do relacionamento entre setores |
| `entrosamento_tripulacao` | varchar(50) | Integração entre integrantes da tripulação |
| `convivencia_regras` | varchar(50) | Convivência alinhada às regras de bom convívio |
| `confianca_respeito_relacoes` | varchar(50) | Confiança e respeito no ambiente |
| `integracao_familia_papem` | varchar(50) | Ações para integrar à Família PAPEM |

#### 🚀 **Seção 3: Motivação / Desenvolvimento Profissional**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `feedback_desempenho_regular` | varchar(50) | Frequência de feedback sobre desempenho |
| `conceito_compativel_desempenho` | varchar(50) | Compatibilidade entre conceito e desempenho |
| `importancia_funcao_papem` | varchar(50) | Percepção da importância da função |
| `trabalho_reconhecido_valorizado` | varchar(50) | Reconhecimento e valorização do trabalho |
| `crescimento_profissional_estimulado` | varchar(50) | Estímulo ao crescimento profissional |
| `cursos_suficientes_atividade` | varchar(50) | Cursos/treinamentos suficientes para a atividade |
| `programa_adestramento_regular` | varchar(50) | Existência de programa regular de adestramento |
| `orgulho_trabalhar_papem` | varchar(50) | Orgulho em atuar na PAPEM |
| `atuacao_area_especializacao` | varchar(50) | Atuação alinhada à especialização |
| `potencial_melhor_em_outra_funcao` | varchar(50) | Percepção sobre melhor aproveitamento em outra função |
| `carga_trabalho_justa` | varchar(50) | Justiça na carga de trabalho |
| `licenca_autorizada_sem_prejuizo` | varchar(50) | Facilidade para concessão de licenças especiais |

#### 💬 **Seção 4: Comentários**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `aspecto_positivo` | text | Destaques positivos sobre a OM |
| `aspecto_negativo` | text | Aspectos que precisam ser solucionados |
| `proposta_processo` | text | Ideias para melhoria de processos |
| `proposta_satisfacao` | text | Sugestões para satisfação/motivação da tripulação |

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

1. **Localizações obrigatórias**: setor, alojamento, banheiro, salão de recreio, rancho e escala exigem seleção de uma opção.
2. **Likert obrigatórias**: todas as perguntas de escala relacionadas ao bloco escolhido devem ser respondidas.
3. **TFM**: perguntas sobre participação, incentivo e instalações do Treinamento Físico Militar são sempre obrigatórias.

---

## 📊 **Índices e Performance**

### 🚀 **Índices Recomendados**
```sql
-- Índice para consultas por setor
CREATE INDEX idx_survey_setor ON survey_responses(setor_localizacao);

-- Índice para consultas por rancho
CREATE INDEX idx_survey_rancho ON survey_responses(rancho_localizacao);

-- Índice para consultas por escala
CREATE INDEX idx_survey_escala ON survey_responses(escala_servico_tipo);

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
SELECT setor_localizacao, COUNT(*) as total
FROM survey_responses
WHERE setor_localizacao IS NOT NULL
GROUP BY setor_localizacao
ORDER BY total DESC;
```

#### Satisfação Geral por Escala
```sql
SELECT escala_servico_tipo,
       CASE resposta
         WHEN 'Concordo totalmente' THEN 'Muito satisfatório'
         WHEN 'Concordo' THEN 'Satisfatório'
         WHEN 'Discordo' THEN 'Insatisfatório'
         WHEN 'Discordo totalmente' THEN 'Muito insatisfatório'
         ELSE 'Neutro'
       END AS classificacao,
       COUNT(*) AS total
FROM survey_responses
CROSS JOIN LATERAL (
  VALUES
    (setor_computadores),
    (setor_mobiliario),
    (setor_limpeza),
    (setor_temperatura),
    (setor_iluminacao),
    (rancho_qualidade_comida),
    (escala_equipamentos_condicao),
    (escala_pernoite_adequada)
) AS respostas(resposta)
WHERE escala_servico_tipo IS NOT NULL AND resposta IS NOT NULL
GROUP BY escala_servico_tipo, classificacao
ORDER BY escala_servico_tipo, total DESC;
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

*Documentação gerada automaticamente pelo Sistema PAPEM - Atualização 2025*
