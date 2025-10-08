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
    setor_localizacao, setor_computadores, setor_mobiliario, setor_limpeza, setor_temperatura, setor_iluminacao,
    alojamento_localizacao, alojamento_limpeza, alojamento_temperatura, alojamento_iluminacao, alojamento_armarios_condicao, alojamento_armario_preservado,
    banheiro_localizacao, banheiro_vasos_suficientes, banheiro_vasos_preservados, banheiro_torneiras_funcionam,
    banheiro_chuveiros_suficientes, banheiro_chuveiros_funcionam, banheiro_limpeza, banheiro_iluminacao,
    recreio_localizacao, recreio_mobiliario_quantidade, recreio_mobiliario_condicao, recreio_limpeza, recreio_temperatura, recreio_iluminacao,
    rancho_localizacao, rancho_qualidade_comida, rancho_mobiliario_condicao, rancho_limpeza, rancho_temperatura, rancho_iluminacao,
    escala_servico_tipo, escala_equipamentos_condicao, escala_pernoite_adequada,
    tfm_participa_regularmente, tfm_incentivo_pratica, tfm_instalacoes_adequadas,
    encarregado_ouve_melhorias, encarregado_fornece_meios, disposicao_contribuir_setor, encarregado_delega, pares_auxiliam_setor,
    relacionamento_intersetorial, entrosamento_tripulacao, convivencia_regras, confianca_respeito_relacoes, integracao_familia_papem,
    feedback_desempenho_regular, conceito_compativel_desempenho, importancia_funcao_papem, trabalho_reconhecido_valorizado,
    crescimento_profissional_estimulado, cursos_suficientes_atividade, programa_adestramento_regular, orgulho_trabalhar_papem,
    atuacao_area_especializacao, potencial_melhor_em_outra_funcao, carga_trabalho_justa, licenca_autorizada_sem_prejuizo,
    aspecto_positivo, aspecto_negativo, proposta_processo, proposta_satisfacao,
    ip_address
) VALUES (
    'PAPEM-10', 'Concordo totalmente', 'Concordo', 'Concordo totalmente', 'Concordo', 'Concordo',
    'CB/MN Masc.', 'Concordo', 'Concordo', 'Concordo', 'Concordo', 'Concordo totalmente',
    'CB/MN Masc.', 'Concordo', 'Concordo totalmente', 'Concordo',
    'Concordo', 'Concordo', 'Concordo', 'Concordo',
    'CB/MN Masc-Fem.', 'Concordo', 'Concordo', 'Concordo', 'Concordo', 'Concordo',
    'Distrito', 'Concordo', 'Concordo', 'Concordo', 'Concordo', 'Concordo',
    'Oficiais', 'Concordo', 'Concordo',
    'Concordo', 'Concordo', 'Concordo',
    'Concordo totalmente', 'Concordo', 'Concordo totalmente', 'Concordo', 'Concordo',
    'Concordo', 'Concordo', 'Concordo', 'Concordo', 'Concordo',
    'Concordo', 'Concordo', 'Concordo', 'Concordo',
    'Concordo', 'Concordo', 'Concordo', 'Concordo',
    'Concordo', 'Discordo', 'Concordo', 'Concordo',
    'O rancho tem mantido a qualidade das refeições.',
    'Precisamos de mais ventilação no salão de recreio.',
    'Implantar manutenção preventiva trimestral nas instalações.',
    'Criar campanhas de integração trimestrais para a tripulação.',
    '127.0.0.1'
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
