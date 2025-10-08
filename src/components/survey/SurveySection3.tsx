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
        questionNumber={1}
        question="Recebo regularmente informações sobre o meu desempenho."
        name="feedback_desempenho_regular"
        value={data.feedback_desempenho_regular || ""}
        onChange={handleChange("feedback_desempenho_regular")}
        options={likertOptions}
        hasError={errors.includes("feedback_desempenho_regular")}
      />

      <Question
        questionNumber={2}
        question="Considero o meu conceito compatível com o meu desempenho profissional."
        name="conceito_compativel_desempenho"
        value={data.conceito_compativel_desempenho || ""}
        onChange={handleChange("conceito_compativel_desempenho")}
        options={likertOptions}
        hasError={errors.includes("conceito_compativel_desempenho")}
      />

      <Question
        questionNumber={3}
        question="Eu identifico a importância da minha função dentro das atividades da PAPEM."
        name="importancia_funcao_papem"
        value={data.importancia_funcao_papem || ""}
        onChange={handleChange("importancia_funcao_papem")}
        options={likertOptions}
        hasError={errors.includes("importancia_funcao_papem")}
      />

      <Question
        questionNumber={4}
        question="Considero que o meu trabalho é reconhecido e valorizado."
        name="trabalho_reconhecido_valorizado"
        value={data.trabalho_reconhecido_valorizado || ""}
        onChange={handleChange("trabalho_reconhecido_valorizado")}
        options={likertOptions}
        hasError={errors.includes("trabalho_reconhecido_valorizado")}
      />

      <Question
        questionNumber={5}
        question="Percebo que o meu desenvolvimento e crescimento profissional são estimulados."
        name="crescimento_profissional_estimulado"
        value={data.crescimento_profissional_estimulado || ""}
        onChange={handleChange("crescimento_profissional_estimulado")}
        options={likertOptions}
        hasError={errors.includes("crescimento_profissional_estimulado")}
      />

      <Question
        questionNumber={6}
        question="Os cursos e treinamentos que fiz são suficientes para o exercício das minhas atividades."
        name="cursos_suficientes_atividade"
        value={data.cursos_suficientes_atividade || ""}
        onChange={handleChange("cursos_suficientes_atividade")}
        options={likertOptions}
        hasError={errors.includes("cursos_suficientes_atividade")}
      />

      <Question
        questionNumber={7}
        question="Percebo que existe um programa de adestramento regular ou que é incentivada a realização de cursos relacionados com minha atividade."
        name="programa_adestramento_regular"
        value={data.programa_adestramento_regular || ""}
        onChange={handleChange("programa_adestramento_regular")}
        options={likertOptions}
        hasError={errors.includes("programa_adestramento_regular")}
      />

      <Question
        questionNumber={8}
        question="Sinto orgulho de trabalhar na PAPEM."
        name="orgulho_trabalhar_papem"
        value={data.orgulho_trabalhar_papem || ""}
        onChange={handleChange("orgulho_trabalhar_papem")}
        options={likertOptions}
        hasError={errors.includes("orgulho_trabalhar_papem")}
      />

      <Question
        questionNumber={9}
        question="Minha função é exercida de acordo com minha área de especialização ou formação profissional."
        name="atuacao_area_especializacao"
        value={data.atuacao_area_especializacao || ""}
        onChange={handleChange("atuacao_area_especializacao")}
        options={likertOptions}
        hasError={errors.includes("atuacao_area_especializacao")}
      />

      <Question
        questionNumber={10}
        question="Desenvolveria melhor meu potencial se estivesse em outra função."
        name="potencial_melhor_em_outra_funcao"
        value={data.potencial_melhor_em_outra_funcao || ""}
        onChange={handleChange("potencial_melhor_em_outra_funcao")}
        options={likertOptions}
        hasError={errors.includes("potencial_melhor_em_outra_funcao")}
      />

      <Question
        questionNumber={11}
        question="Considero justo minha carga de trabalho e minhas atribuições."
        name="carga_trabalho_justa"
        value={data.carga_trabalho_justa || ""}
        onChange={handleChange("carga_trabalho_justa")}
        options={likertOptions}
        hasError={errors.includes("carga_trabalho_justa")}
      />

      <Question
        questionNumber={12}
        question="Quando necessito gozar algum tipo de licença especial, sou autorizado pelo meu chefe, sem prejuízo ao serviço."
        name="licenca_autorizada_sem_prejuizo"
        value={data.licenca_autorizada_sem_prejuizo || ""}
        onChange={handleChange("licenca_autorizada_sem_prejuizo")}
        options={likertOptions}
        hasError={errors.includes("licenca_autorizada_sem_prejuizo")}
      />
    </div>
  );
}