import { Question } from "./Question";

interface SurveySection3Props {
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

export function SurveySection3({ data, onUpdate, errors = [] }: SurveySection3Props) {
  const handleChange = (field: string) => (value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-2">
      <Question
        questionNumber={30}
        question="Recebo regularmente informações sobre o meu desempenho."
        name="feedback_desempenho"
        value={data.feedback_desempenho || ""}
        onChange={handleChange("feedback_desempenho")}
        options={likertOptions}
        hasError={errors.includes("feedback_desempenho")}
      />

      <Question
        questionNumber={31}
        question="Considero o meu conceito compatível com o meu desempenho."
        name="conceito_compativel"
        value={data.conceito_compativel || ""}
        onChange={handleChange("conceito_compativel")}
        options={likertOptions}
        hasError={errors.includes("conceito_compativel")}
      />

      <Question
        questionNumber={32}
        question="Eu identifico a importância da minha atividade dentro do processo global."
        name="importancia_atividade"
        value={data.importancia_atividade || ""}
        onChange={handleChange("importancia_atividade")}
        options={likertOptions}
        hasError={errors.includes("importancia_atividade")}
      />

      <Question
        questionNumber={33}
        question="Considero que o meu trabalho é reconhecido e valorizado."
        name="trabalho_reconhecido"
        value={data.trabalho_reconhecido || ""}
        onChange={handleChange("trabalho_reconhecido")}
        options={likertOptions}
        hasError={errors.includes("trabalho_reconhecido")}
      />

      <Question
        questionNumber={34}
        question="Percebo que o meu desenvolvimento e crescimento profissional são estimulados."
        name="crescimento_estimulado"
        value={data.crescimento_estimulado || ""}
        onChange={handleChange("crescimento_estimulado")}
        options={likertOptions}
        hasError={errors.includes("crescimento_estimulado")}
      />

      <Question
        questionNumber={35}
        question="Os cursos e treinamentos que fiz são suficientes para o exercício das minhas atividades."
        name="cursos_suficientes"
        value={data.cursos_suficientes || ""}
        onChange={handleChange("cursos_suficientes")}
        options={likertOptions}
        hasError={errors.includes("cursos_suficientes")}
      />

      <Question
        questionNumber={36}
        question="Percebo que existe um programa de treinamento profissional regular ou que é incentivada a realização de cursos relacionados com minha atividade."
        name="programa_treinamento"
        value={data.programa_treinamento || ""}
        onChange={handleChange("programa_treinamento")}
        options={likertOptions}
        hasError={errors.includes("programa_treinamento")}
      />

      <Question
        questionNumber={37}
        question="Sinto orgulho de trabalhar aqui."
        name="orgulho_trabalhar"
        value={data.orgulho_trabalhar || ""}
        onChange={handleChange("orgulho_trabalhar")}
        options={likertOptions}
        hasError={errors.includes("orgulho_trabalhar")}
      />

      <Question
        questionNumber={38}
        question="Estou sendo bem aproveitado, de acordo com minha área de especialização ou formação profissional."
        name="bem_aproveitado"
        value={data.bem_aproveitado || ""}
        onChange={handleChange("bem_aproveitado")}
        options={likertOptions}
        hasError={errors.includes("bem_aproveitado")}
      />

      <Question
        questionNumber={39}
        question="Desenvolveria melhor meu potencial se estivesse em outra função."
        name="potencial_outra_funcao"
        value={data.potencial_outra_funcao || ""}
        onChange={handleChange("potencial_outra_funcao")}
        options={likertOptions}
        hasError={errors.includes("potencial_outra_funcao")}
      />

      <Question
        questionNumber={40}
        question="Considero justa minha carga de trabalho e minhas atribuições."
        name="carga_trabalho_justa"
        value={data.carga_trabalho_justa || ""}
        onChange={handleChange("carga_trabalho_justa")}
        options={likertOptions}
        hasError={errors.includes("carga_trabalho_justa")}
      />

      <Question
        questionNumber={41}
        question="Quando necessito gozar algum tipo de licença especial, sou autorizado pelo meu chefe, sem problemas."
        name="licenca_autorizada"
        value={data.licenca_autorizada || ""}
        onChange={handleChange("licenca_autorizada")}
        options={likertOptions}
        hasError={errors.includes("licenca_autorizada")}
      />
    </div>
  );
}