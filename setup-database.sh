#!/bin/bash

# Script de configuração do banco PostgreSQL para PAPEM - Sistema de Clima Organizacional
# Autor: Sistema PAPEM
# Data: $(date +%Y-%m-%d)

echo "🚀 Iniciando configuração do banco PostgreSQL para PAPEM..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações do banco
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="papem_clima_organizacional"
DB_USER="postgres"
DB_PASS="postgres123"

echo -e "${BLUE}📋 Configurações do banco:${NC}"
echo -e "   Host: ${DB_HOST}"
echo -e "   Porta: ${DB_PORT}"
echo -e "   Banco: ${DB_NAME}"
echo -e "   Usuário: ${DB_USER}"
echo ""

# Função para verificar se PostgreSQL está rodando
check_postgresql() {
    echo -e "${YELLOW}🔍 Verificando se PostgreSQL está rodando...${NC}"
    
    if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
        echo -e "${GREEN}✅ PostgreSQL está rodando!${NC}"
        return 0
    else
        echo -e "${RED}❌ PostgreSQL não está rodando ou não está acessível.${NC}"
        echo -e "${RED}   Verifique se o PostgreSQL está instalado e rodando.${NC}"
        echo -e "${RED}   Comando para iniciar: sudo systemctl start postgresql${NC}"
        return 1
    fi
}

# Função para criar banco de dados
create_database() {
    echo -e "${YELLOW}🏗️  Criando banco de dados '${DB_NAME}'...${NC}"
    
    # Verificar se banco já existe
    DB_EXISTS=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; echo $?)
    
    if [ $DB_EXISTS -eq 0 ]; then
        echo -e "${YELLOW}⚠️  Banco '${DB_NAME}' já existe. Deseja recriar? (y/N)${NC}"
        read -r response
        if [[ $response =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}🗑️  Removendo banco existente...${NC}"
            PGPASSWORD=$DB_PASS dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        else
            echo -e "${GREEN}✅ Usando banco existente.${NC}"
            return 0
        fi
    fi
    
    # Criar o banco
    if PGPASSWORD=$DB_PASS createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME -E UTF8; then
        echo -e "${GREEN}✅ Banco '${DB_NAME}' criado com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao criar banco '${DB_NAME}'.${NC}"
        return 1
    fi
}

# Função para executar migrations
run_migrations() {
    echo -e "${YELLOW}📊 Executando migrations do Drizzle...${NC}"
    
    if npm run db:push; then
        echo -e "${GREEN}✅ Migrations executadas com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao executar migrations.${NC}"
        return 1
    fi
}

# Função para inserir dados de teste (opcional)
insert_test_data() {
    echo -e "${YELLOW}📝 Deseja inserir dados de teste? (y/N)${NC}"
    read -r response
    
    if [[ $response =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🧪 Inserindo dados de teste...${NC}"
        
        PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
-- Inserir resposta de teste
INSERT INTO survey_responses (
    setor_trabalho, materiais_fornecidos, materiais_adequados, atendimento_apoio,
    ambiente_trabalho, chefia_disponivel, chefia_orientacao,
    localizacao_rancho, rancho_instalacoes, rancho_qualidade,
    escala_servico, escala_atrapalha, equipamentos_servico,
    tfm_participa, tfm_incentivado, tfm_instalacoes,
    pares_auxiliam, pares_cooperacao, chefia_dialogo, comunicacao_eficaz,
    reconhecimento_trabalho, satisfacao_geral,
    comentarios_gerais, ip_address
) VALUES (
    'SECRETARIA', 'Concordo totalmente', 'Concordo', 'Concordo totalmente',
    'Concordo totalmente', 'Concordo', 'Concordo totalmente',
    'Distrito', 'Concordo', 'Concordo totalmente',
    'Oficiais', 'Discordo', 'Concordo',
    'Concordo', 'Concordo totalmente', 'Concordo',
    'Concordo', 'Concordo', 'Concordo totalmente', 'Concordo',
    'Concordo', 'Concordo totalmente',
    'Resposta de teste inserida automaticamente pelo script de setup.', '127.0.0.1'
);

-- Inserir estatísticas iniciais
INSERT INTO survey_stats (total_responses) VALUES (1);
EOF
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Dados de teste inseridos com sucesso!${NC}"
        else
            echo -e "${RED}❌ Erro ao inserir dados de teste.${NC}"
        fi
    fi
}

# Função para testar conexão
test_connection() {
    echo -e "${YELLOW}🔗 Testando conexão com o banco...${NC}"
    
    if PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'Conexão OK!' as status, NOW() as timestamp;"; then
        echo -e "${GREEN}✅ Conexão testada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro na conexão com o banco.${NC}"
        return 1
    fi
}

# Função principal
main() {
    echo -e "${BLUE}🎯 PAPEM - Sistema de Pesquisa de Clima Organizacional${NC}"
    echo -e "${BLUE}   Configuração do Banco PostgreSQL${NC}"
    echo ""
    
    # Verificar PostgreSQL
    if ! check_postgresql; then
        exit 1
    fi
    
    # Criar banco
    if ! create_database; then
        exit 1
    fi
    
    # Executar migrations
    if ! run_migrations; then
        exit 1
    fi
    
    # Testar conexão
    if ! test_connection; then
        exit 1
    fi
    
    # Dados de teste (opcional)
    insert_test_data
    
    echo ""
    echo -e "${GREEN}🎉 Configuração concluída com sucesso!${NC}"
    echo -e "${GREEN}   O banco PostgreSQL está pronto para uso.${NC}"
    echo ""
    echo -e "${BLUE}📋 Informações de conexão:${NC}"
    echo -e "   URL: postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
    echo -e "   Host: ${DB_HOST}"
    echo -e "   Porta: ${DB_PORT}"
    echo -e "   Banco: ${DB_NAME}"
    echo -e "   Usuário: ${DB_USER}"
    echo ""
    echo -e "${YELLOW}💡 Para iniciar a aplicação: npm run dev${NC}"
    echo -e "${YELLOW}💡 Para acessar o banco: psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}${NC}"
}

# Executar função principal
main "$@"
