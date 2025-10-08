import { Question } from "./Question";

interface SurveySection2Props {
  data: any;
  onUpdate: (data: any) => void;
  errors?: string[];
}

const likertOptions = [
  { value: "Concordo totalmente", label: "Concordo totalmente" },
  { value: "Concordo", label: "Concordo" },
  { value: "Discordo", label: "Discordo" },
  { value: "Discordo totalmente", label: "Discordo totalmente" }
];

export function SurveySection2({ data, onUpdate, errors = [] }: SurveySection2Props) {
  const handleChange = (field: string) => (value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-2">
      <Question
        questionNumber={1}
        question="Meu Encarregado está interessado em ouvir as minhas propostas de melhoria de processo."
        name="encarregado_ouve_melhorias"
        value={data.encarregado_ouve_melhorias || ""}
        onChange={handleChange("encarregado_ouve_melhorias")}
        options={likertOptions}
        hasError={errors.includes("encarregado_ouve_melhorias")}
      />

      <Question
        questionNumber={2}
        question="O meu Encarregado fornece os meios necessários para o cumprimento das minhas atribuições."
        name="encarregado_fornece_meios"
        value={data.encarregado_fornece_meios || ""}
        onChange={handleChange("encarregado_fornece_meios")}
        options={likertOptions}
        hasError={errors.includes("encarregado_fornece_meios")}
      />

      <Question
        questionNumber={3}
        question="Estou interessado em contribuir com as atividades e tarefas do meu setor."
        name="disposicao_contribuir_setor"
        value={data.disposicao_contribuir_setor || ""}
        onChange={handleChange("disposicao_contribuir_setor")}
        options={likertOptions}
        hasError={errors.includes("disposicao_contribuir_setor")}
      />

      <Question
        questionNumber={4}
        question="O meu Encarregado sabe delegar responsabilidades."
        name="encarregado_delega"
        value={data.encarregado_delega || ""}
        onChange={handleChange("encarregado_delega")}
        options={likertOptions}
        hasError={errors.includes("encarregado_delega")}
      />

      <Question
        questionNumber={5}
        question="Meus pares me auxiliam sempre que preciso resolver problemas do meu setor."
        name="pares_auxiliam_setor"
        value={data.pares_auxiliam_setor || ""}
        onChange={handleChange("pares_auxiliam_setor")}
        options={likertOptions}
        hasError={errors.includes("pares_auxiliam_setor")}
      />

      <Question
        questionNumber={6}
        question="O relacionamento entre os setores é considerado satisfatório."
        name="relacionamento_intersetorial"
        value={data.relacionamento_intersetorial || ""}
        onChange={handleChange("relacionamento_intersetorial")}
        options={likertOptions}
        hasError={errors.includes("relacionamento_intersetorial")}
      />

      <Question
        questionNumber={7}
        question="Existe um bom entrosamento entre os integrantes da Tripulação."
        name="entrosamento_tripulacao"
        value={data.entrosamento_tripulacao || ""}
        onChange={handleChange("entrosamento_tripulacao")}
        options={likertOptions}
        hasError={errors.includes("entrosamento_tripulacao")}
      />

      <Question
        questionNumber={8}
        question="A convivência com meus pares e superiores observa as regras do “bom convívio”."
        name="convivencia_regras"
        value={data.convivencia_regras || ""}
        onChange={handleChange("convivencia_regras")}
        options={likertOptions}
        hasError={errors.includes("convivencia_regras")}
      />

      <Question
        questionNumber={9}
        question="Existe confiança e respeito nas relações no meu ambiente de trabalho."
        name="confianca_respeito_relacoes"
        value={data.confianca_respeito_relacoes || ""}
        onChange={handleChange("confianca_respeito_relacoes")}
        options={likertOptions}
        hasError={errors.includes("confianca_respeito_relacoes")}
      />

      <Question
        questionNumber={10}
        question="A OM adota as medidas necessárias para que os integrantes da tripulação sintam-se integrados à Família PAPEM."
        name="integracao_familia_papem"
        value={data.integracao_familia_papem || ""}
        onChange={handleChange("integracao_familia_papem")}
        options={likertOptions}
        hasError={errors.includes("integracao_familia_papem")}
      />
    </div>
  );
}