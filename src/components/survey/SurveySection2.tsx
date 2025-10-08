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
        questionNumber={21}
        question="Meu chefe está interessado em ouvir as minhas ideias."
        name="chefe_ouve_ideias"
        value={data.chefe_ouve_ideias || ""}
        onChange={handleChange("chefe_ouve_ideias")}
        options={likertOptions}
        hasError={errors.includes("chefe_ouve_ideias")}
      />

      <Question
        questionNumber={22}
        question="O meu chefe se importa comigo como pessoa."
        name="chefe_se_importa"
        value={data.chefe_se_importa || ""}
        onChange={handleChange("chefe_se_importa")}
        options={likertOptions}
        hasError={errors.includes("chefe_se_importa")}
      />

      <Question
        questionNumber={23}
        question="Estou interessado em contribuir com as atividades e tarefas."
        name="contribuir_atividades"
        value={data.contribuir_atividades || ""}
        onChange={handleChange("contribuir_atividades")}
        options={likertOptions}
        hasError={errors.includes("contribuir_atividades")}
      />

      <Question
        questionNumber={24}
        question="O meu chefe sabe delegar responsabilidades."
        name="chefe_delega"
        value={data.chefe_delega || ""}
        onChange={handleChange("chefe_delega")}
        options={likertOptions}
        hasError={errors.includes("chefe_delega")}
      />

      <Question
        questionNumber={25}
        question="Meus pares me auxiliam sempre que preciso para resolver meus problemas de trabalho."
        name="pares_auxiliam"
        value={data.pares_auxiliam || ""}
        onChange={handleChange("pares_auxiliam")}
        options={likertOptions}
        hasError={errors.includes("pares_auxiliam")}
      />

      <Question
        questionNumber={26}
        question="Existe um bom entrosamento entre os setores."
        name="entrosamento_setores"
        value={data.entrosamento_setores || ""}
        onChange={handleChange("entrosamento_setores")}
        options={likertOptions}
        hasError={errors.includes("entrosamento_setores")}
      />

      <Question
        questionNumber={27}
        question="Existe um bom entrosamento entre os integrantes da Tripulação."
        name="entrosamento_tripulacao"
        value={data.entrosamento_tripulacao || ""}
        onChange={handleChange("entrosamento_tripulacao")}
        options={likertOptions}
        hasError={errors.includes("entrosamento_tripulacao")}
      />

      <Question
        questionNumber={28}
        question="O convívio com meus pares e superiores é agradável."
        name="convivio_agradavel"
        value={data.convivio_agradavel || ""}
        onChange={handleChange("convivio_agradavel")}
        options={likertOptions}
        hasError={errors.includes("convivio_agradavel")}
      />

      <Question
        questionNumber={29}
        question="Existe confiança e respeito nas relações no ambiente de trabalho."
        name="confianca_respeito"
        value={data.confianca_respeito || ""}
        onChange={handleChange("confianca_respeito")}
        options={likertOptions}
        hasError={errors.includes("confianca_respeito")}
      />
    </div>
  );
}