import { Question } from "./Question";
import { SelectQuestion } from "./SelectQuestion";

interface SurveySection1Props {
  data: any;
  onUpdate: (data: any) => void;
  errors?: string[];
}

const likertOptions = [
  { value: "Discordo", label: "Discordo" },
  { value: "Não concordo e nem discordo", label: "Não concordo e nem discordo" },
  { value: "Concordo", label: "Concordo" }
];

const setorOptions = [
  { value: "PAPEM-10", label: "PAPEM-10" },
  { value: "PAPEM-20", label: "PAPEM-20" },
  { value: "PAPEM-30", label: "PAPEM-30" },
  { value: "PAPEM-40", label: "PAPEM-40" },
  { value: "PAPEM-51", label: "PAPEM-51" },
  { value: "PAPEM-52", label: "PAPEM-52" },
  { value: "SECOM", label: "SECOM" }
];

const alojamentoOptions = [
  { value: "CB/MN MASCULINO", label: "CB/MN MASCULINO" },
  { value: "CB/MN FEMININO", label: "CB/MN FEMININO" },
  { value: "SO/SG MASCULINO", label: "SO/SG MASCULINO" },
  { value: "SO/SG FEMININO", label: "SO/SG FEMININO" },
  { value: "OFICIAIS FEMININO", label: "OFICIAIS FEMININO" },
  { value: "CT/1T MASCULINO", label: "CT/1T MASCULINO" },
  { value: "OFICIAIS SUPERIORES MASCULINO", label: "OFICIAIS SUPERIORES MASCULINO" }
];

const ranchoOptions = [
  { value: "Distrito", label: "Distrito" },
  { value: "DABM", label: "DABM" },
  { value: "Praça D'armas", label: "Praça D'armas" }
];

const escalaOptions = [
  { value: "Oficiais", label: "Oficiais" },
  { value: "SG", label: "SG" },
  { value: "Cb/MN", label: "Cb/MN" }
];

export function SurveySection1({ data, onUpdate, errors = [] }: SurveySection1Props) {
  const handleChange = (field: string) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    
    // Limpar Praça D'armas quando rancho não for "Praça D'armas"
    if (field === "localizacao_rancho" && value !== "Praça D'armas") {
      updatedData.praca_darmas_adequada = "";
    }
    
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-2">
      <SelectQuestion
        questionNumber={1}
        question="Área principal de trabalho:"
        name="setor_trabalho"
        value={data.setor_trabalho || ""}
        onChange={handleChange("setor_trabalho")}
        options={setorOptions}
        placeholder="Selecione uma área"
        hasError={errors.includes("setor_trabalho")}
      />

      <Question
        questionNumber={2}
        question="Os materiais e equipamentos necessários para realizar o meu trabalho são fornecidos."
        name="materiais_fornecidos"
        value={data.materiais_fornecidos || ""}
        onChange={handleChange("materiais_fornecidos")}
        options={likertOptions}
        hasError={errors.includes("materiais_fornecidos")}
      />

      <Question
        questionNumber={3}
        question="Os materiais e equipamentos disponibilizados para o desempenho do meu trabalho estão adequados (estão em boas condições)."
        name="materiais_adequados"
        value={data.materiais_adequados || ""}
        onChange={handleChange("materiais_adequados")}
        options={likertOptions}
        hasError={errors.includes("materiais_adequados")}
      />

      <Question
        questionNumber={4}
        question="O atendimento realizado pelo Setor de Apoio da OM tem sido prestado dentro das minhas expectativas."
        name="atendimento_apoio"
        value={data.atendimento_apoio || ""}
        onChange={handleChange("atendimento_apoio")}
        options={likertOptions}
        hasError={errors.includes("atendimento_apoio")}
      />

      <Question
        questionNumber={5}
        question="A limpeza é adequada."
        name="limpeza_adequada"
        value={data.limpeza_adequada || ""}
        onChange={handleChange("limpeza_adequada")}
        options={likertOptions}
        hasError={errors.includes("limpeza_adequada")}
      />

      <Question
        questionNumber={6}
        question="A temperatura é adequada."
        name="temperatura_adequada"
        value={data.temperatura_adequada || ""}
        onChange={handleChange("temperatura_adequada")}
        options={likertOptions}
        hasError={errors.includes("temperatura_adequada")}
      />

      <Question
        questionNumber={7}
        question="A iluminação é adequada."
        name="iluminacao_adequada"
        value={data.iluminacao_adequada || ""}
        onChange={handleChange("iluminacao_adequada")}
        options={likertOptions}
        hasError={errors.includes("iluminacao_adequada")}
      />

      <SelectQuestion
        questionNumber={8}
        question="Para análise das condições dos alojamentos, informe sua localização:"
        name="localizacao_alojamento"
        value={data.localizacao_alojamento || ""}
        onChange={handleChange("localizacao_alojamento")}
        options={alojamentoOptions}
        placeholder="Selecione um alojamento"
        hasError={errors.includes("localizacao_alojamento")}
      />

      {/* Questões 9, 10 - Sempre visíveis */}
      <Question
        questionNumber={9}
        question="As instalações do meu alojamento estão em boas condições."
        name="alojamento_condicoes"
        value={data.alojamento_condicoes || ""}
        onChange={handleChange("alojamento_condicoes")}
        options={likertOptions}
        hasError={errors.includes("alojamento_condicoes")}
      />

      <Question
        questionNumber={10}
        question="As instalações dos banheiros da OM são adequadas."
        name="banheiros_adequados"
        value={data.banheiros_adequados || ""}
        onChange={handleChange("banheiros_adequados")}
        options={likertOptions}
        hasError={errors.includes("banheiros_adequados")}
      />

      <SelectQuestion
        questionNumber={11}
        question="Para análise das condições do rancho, informe sua localização (marque apenas uma opção):"
        name="localizacao_rancho"
        value={data.localizacao_rancho || ""}
        onChange={handleChange("localizacao_rancho")}
        options={ranchoOptions}
        placeholder="Selecione um local"
        hasError={errors.includes("localizacao_rancho")}
      />

      {/* Questão 12 - Só aparece quando localização do rancho for "Praça D'armas" */}
      {data.localizacao_rancho === "Praça D'armas" && (
        <Question
          questionNumber={12}
          question="As instalações da Praça D'armas e do Salão de Recreio da OM são adequadas."
          name="praca_darmas_adequada"
          value={data.praca_darmas_adequada || ""}
          onChange={handleChange("praca_darmas_adequada")}
          options={likertOptions}
          hasError={errors.includes("praca_darmas_adequada")}
        />
      )}

      {/* Questões seguintes - numeração dinâmica baseada se Q12 aparece */}
      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 13 : 12}
        question="Considero adequadas as instalações do rancho."
        name="rancho_instalacoes"
        value={data.rancho_instalacoes || ""}
        onChange={handleChange("rancho_instalacoes")}
        options={likertOptions}
        hasError={errors.includes("rancho_instalacoes")}
      />

      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 14 : 13}
        question="Estou satisfeito com a qualidade da comida servida no rancho."
        name="rancho_qualidade"
        value={data.rancho_qualidade || ""}
        onChange={handleChange("rancho_qualidade")}
        options={likertOptions}
        hasError={errors.includes("rancho_qualidade")}
      />

      <SelectQuestion
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 15 : 14}
        question="Para análise das condições da escala de serviço, informe sua escala (marque apenas uma opção):"
        name="escala_servico"
        value={data.escala_servico || ""}
        onChange={handleChange("escala_servico")}
        options={escalaOptions}
        placeholder="Selecione uma escala"
        hasError={errors.includes("escala_servico")}
      />

      {/* Questões 16-20 - Sempre visíveis */}
      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 16 : 15}
        question="A escala de serviço tem atrapalhado as minhas tarefas profissionais."
        name="escala_atrapalha"
        value={data.escala_atrapalha || ""}
        onChange={handleChange("escala_atrapalha")}
        options={likertOptions}
        hasError={errors.includes("escala_atrapalha")}
      />

      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 17 : 16}
        question="Quando estou de serviço, percebo que os equipamentos utilizados estão em boas condições."
        name="equipamentos_servico"
        value={data.equipamentos_servico || ""}
        onChange={handleChange("equipamentos_servico")}
        options={likertOptions}
        hasError={errors.includes("equipamentos_servico")}
      />

      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 18 : 17}
        question="Participo com regularidade do Treinamento Físico Militar."
        name="tfm_participa"
        value={data.tfm_participa || ""}
        onChange={handleChange("tfm_participa")}
        options={likertOptions}
        hasError={errors.includes("tfm_participa")}
      />

      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 19 : 18}
        question="É incentivada a prática de Treinamento Físico Militar."
        name="tfm_incentivado"
        value={data.tfm_incentivado || ""}
        onChange={handleChange("tfm_incentivado")}
        options={likertOptions}
        hasError={errors.includes("tfm_incentivado")}
      />

      <Question
        questionNumber={data.localizacao_rancho === "Praça D'armas" ? 20 : 19}
        question="Considero as instalações para a prática de Treinamento Físico Militar adequadas."
        name="tfm_instalacoes"
        value={data.tfm_instalacoes || ""}
        onChange={handleChange("tfm_instalacoes")}
        options={likertOptions}
        hasError={errors.includes("tfm_instalacoes")}
      />
    </div>
  );
}