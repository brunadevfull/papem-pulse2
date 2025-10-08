import { Question } from "./Question";
import { SelectQuestion } from "./SelectQuestion";

interface SurveySection1Props {
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

const setorOptions = [
  { value: "PAPEM-10", label: "PAPEM-10" },
  { value: "PAPEM-20", label: "PAPEM-20" },
  { value: "PAPEM-30", label: "PAPEM-30" },
  { value: "PAPEM-40", label: "PAPEM-40" },
  { value: "PAPEM-51", label: "PAPEM-51" },
  { value: "PAPEM-52", label: "PAPEM-52" },
  { value: "SECOM", label: "SECOM" },
  { value: "GABINETE", label: "GABINETE" }
];

const alojamentoOptions = [
  { value: "CB/MN Masc.", label: "CB/MN Masc." },
  { value: "CB/MN Fem.", label: "CB/MN Fem." },
  { value: "SO/SG Masc.", label: "SO/SG Masc." },
  { value: "SO/SG Fem.", label: "SO/SG Fem." },
  { value: "Of. Fem.", label: "Of. Fem." },
  { value: "CT/T Masc.", label: "CT/T Masc." },
  { value: "Of Sup. Masc.", label: "Of Sup. Masc." }
];

const banheiroOptions = [
  { value: "CB/MN Masc.", label: "CB/MN Masc." },
  { value: "CB/MN Fem.", label: "CB/MN Fem." },
  { value: "SO/SG Masc.", label: "SO/SG Masc." },
  { value: "SO/SG Fem.", label: "SO/SG Fem." },
  { value: "Of. Fem.", label: "Of. Fem." },
  { value: "CT/T Masc.", label: "CT/T Masc." },
  { value: "Of Sup. Masc.", label: "Of Sup. Masc." }
];

const recreioOptions = [
  { value: "CB/MN Masc-Fem.", label: "CB/MN Masc-Fem." },
  { value: "SO/SG Masc-Fem.", label: "SO/SG Masc-Fem." },
  { value: "Oficiais", label: "Oficiais" }
];

const ranchoOptions = [
  { value: "Distrito", label: "Distrito" },
  { value: "DAbM", label: "DAbM" },
  { value: "Praça d’armas", label: "Praça d’armas" }
];

const escalaOptions = [
  { value: "Oficiais", label: "Oficiais" },
  { value: "SG", label: "SG" },
  { value: "CB/MN", label: "CB/MN" },
  { value: "Não se aplica", label: "Não se aplica" }
];

export function SurveySection1({ data, onUpdate, errors = [] }: SurveySection1Props) {
  const handleChange = (field: string) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-2">
      <SelectQuestion
        question="Para análise das condições do setor de trabalho, informar a localização do setor:"
        name="setor_localizacao"
        value={data.setor_localizacao || ""}
        onChange={handleChange("setor_localizacao")}
        options={setorOptions}
        placeholder="Selecione um setor"
        hasError={errors.includes("setor_localizacao")}
      />

      <Question
        questionNumber={1}
        question="Os computadores do setor necessários para realizar o meu trabalho são adequados."
        name="setor_computadores"
        value={data.setor_computadores || ""}
        onChange={handleChange("setor_computadores")}
        options={likertOptions}
        hasError={errors.includes("setor_computadores")}
      />

      <Question
        questionNumber={2}
        question="Os mobiliários e as instalações do setor são adequados (estão em boas condições)."
        name="setor_mobiliario"
        value={data.setor_mobiliario || ""}
        onChange={handleChange("setor_mobiliario")}
        options={likertOptions}
        hasError={errors.includes("setor_mobiliario")}
      />

      <Question
        questionNumber={3}
        question="A limpeza do setor é adequada."
        name="setor_limpeza"
        value={data.setor_limpeza || ""}
        onChange={handleChange("setor_limpeza")}
        options={likertOptions}
        hasError={errors.includes("setor_limpeza")}
      />

      <Question
        questionNumber={4}
        question="A temperatura do setor é adequada."
        name="setor_temperatura"
        value={data.setor_temperatura || ""}
        onChange={handleChange("setor_temperatura")}
        options={likertOptions}
        hasError={errors.includes("setor_temperatura")}
      />

      <Question
        questionNumber={5}
        question="A iluminação do setor é adequada."
        name="setor_iluminacao"
        value={data.setor_iluminacao || ""}
        onChange={handleChange("setor_iluminacao")}
        options={likertOptions}
        hasError={errors.includes("setor_iluminacao")}
      />

      <SelectQuestion
        question="Para análise das condições dos alojamentos, informar a localização do alojamento:"
        name="alojamento_localizacao"
        value={data.alojamento_localizacao || ""}
        onChange={handleChange("alojamento_localizacao")}
        options={alojamentoOptions}
        placeholder="Selecione um alojamento"
        hasError={errors.includes("alojamento_localizacao")}
      />

      <Question
        questionNumber={6}
        question="A limpeza do alojamento é adequada."
        name="alojamento_limpeza"
        value={data.alojamento_limpeza || ""}
        onChange={handleChange("alojamento_limpeza")}
        options={likertOptions}
        hasError={errors.includes("alojamento_limpeza")}
      />

      <Question
        questionNumber={7}
        question="A temperatura do alojamento é adequada."
        name="alojamento_temperatura"
        value={data.alojamento_temperatura || ""}
        onChange={handleChange("alojamento_temperatura")}
        options={likertOptions}
        hasError={errors.includes("alojamento_temperatura")}
      />

      <Question
        questionNumber={8}
        question="A iluminação do alojamento é adequada."
        name="alojamento_iluminacao"
        value={data.alojamento_iluminacao || ""}
        onChange={handleChange("alojamento_iluminacao")}
        options={likertOptions}
        hasError={errors.includes("alojamento_iluminacao")}
      />

      <Question
        questionNumber={9}
        question="Os armários estão em boas condições de pintura e preservação."
        name="alojamento_armarios_condicao"
        value={data.alojamento_armarios_condicao || ""}
        onChange={handleChange("alojamento_armarios_condicao")}
        options={likertOptions}
        hasError={errors.includes("alojamento_armarios_condicao")}
      />

      <Question
        questionNumber={10}
        question="Tenho realizado a limpeza e arrumação do meu armário de modo a preservá-lo."
        name="alojamento_armario_preservado"
        value={data.alojamento_armario_preservado || ""}
        onChange={handleChange("alojamento_armario_preservado")}
        options={likertOptions}
        hasError={errors.includes("alojamento_armario_preservado")}
      />

      <SelectQuestion
        question="Para análise das condições dos banheiros, informar a localização do banheiro:"
        name="banheiro_localizacao"
        value={data.banheiro_localizacao || ""}
        onChange={handleChange("banheiro_localizacao")}
        options={banheiroOptions}
        placeholder="Selecione um banheiro"
        hasError={errors.includes("banheiro_localizacao")}
      />

      <Question
        questionNumber={11}
        question="Os vasos são suficientes para o contingente de usuários."
        name="banheiro_vasos_suficientes"
        value={data.banheiro_vasos_suficientes || ""}
        onChange={handleChange("banheiro_vasos_suficientes")}
        options={likertOptions}
        hasError={errors.includes("banheiro_vasos_suficientes")}
      />

      <Question
        questionNumber={12}
        question="Os vasos estão em boas condições de limpeza e preservação."
        name="banheiro_vasos_preservados"
        value={data.banheiro_vasos_preservados || ""}
        onChange={handleChange("banheiro_vasos_preservados")}
        options={likertOptions}
        hasError={errors.includes("banheiro_vasos_preservados")}
      />

      <Question
        questionNumber={13}
        question="As torneiras funcionam adequadamente."
        name="banheiro_torneiras_funcionam"
        value={data.banheiro_torneiras_funcionam || ""}
        onChange={handleChange("banheiro_torneiras_funcionam")}
        options={likertOptions}
        hasError={errors.includes("banheiro_torneiras_funcionam")}
      />

      <Question
        questionNumber={14}
        question="Os chuveiros são suficientes para o contingente de usuários."
        name="banheiro_chuveiros_suficientes"
        value={data.banheiro_chuveiros_suficientes || ""}
        onChange={handleChange("banheiro_chuveiros_suficientes")}
        options={likertOptions}
        hasError={errors.includes("banheiro_chuveiros_suficientes")}
      />

      <Question
        questionNumber={15}
        question="Os chuveiros funcionam adequadamente."
        name="banheiro_chuveiros_funcionam"
        value={data.banheiro_chuveiros_funcionam || ""}
        onChange={handleChange("banheiro_chuveiros_funcionam")}
        options={likertOptions}
        hasError={errors.includes("banheiro_chuveiros_funcionam")}
      />

      <Question
        questionNumber={16}
        question="A limpeza do banheiro é adequada."
        name="banheiro_limpeza"
        value={data.banheiro_limpeza || ""}
        onChange={handleChange("banheiro_limpeza")}
        options={likertOptions}
        hasError={errors.includes("banheiro_limpeza")}
      />

      <Question
        questionNumber={17}
        question="A iluminação do banheiro é adequada."
        name="banheiro_iluminacao"
        value={data.banheiro_iluminacao || ""}
        onChange={handleChange("banheiro_iluminacao")}
        options={likertOptions}
        hasError={errors.includes("banheiro_iluminacao")}
      />

      <SelectQuestion
        question="Para análise das condições dos salões de recreio, informar a localização do salão:"
        name="recreio_localizacao"
        value={data.recreio_localizacao || ""}
        onChange={handleChange("recreio_localizacao")}
        options={recreioOptions}
        placeholder="Selecione um salão"
        hasError={errors.includes("recreio_localizacao")}
      />

      <Question
        questionNumber={18}
        question="A quantidade de mobiliário do salão de recreio é adequada para o contingente de usuários."
        name="recreio_mobiliario_quantidade"
        value={data.recreio_mobiliario_quantidade || ""}
        onChange={handleChange("recreio_mobiliario_quantidade")}
        options={likertOptions}
        hasError={errors.includes("recreio_mobiliario_quantidade")}
      />

      <Question
        questionNumber={19}
        question="O mobiliário do salão de recreio está em boas condições."
        name="recreio_mobiliario_condicao"
        value={data.recreio_mobiliario_condicao || ""}
        onChange={handleChange("recreio_mobiliario_condicao")}
        options={likertOptions}
        hasError={errors.includes("recreio_mobiliario_condicao")}
      />

      <Question
        questionNumber={20}
        question="A limpeza do salão de recreio é adequada."
        name="recreio_limpeza"
        value={data.recreio_limpeza || ""}
        onChange={handleChange("recreio_limpeza")}
        options={likertOptions}
        hasError={errors.includes("recreio_limpeza")}
      />

      <Question
        questionNumber={21}
        question="A temperatura do salão de recreio é adequada."
        name="recreio_temperatura"
        value={data.recreio_temperatura || ""}
        onChange={handleChange("recreio_temperatura")}
        options={likertOptions}
        hasError={errors.includes("recreio_temperatura")}
      />

      <Question
        questionNumber={22}
        question="A iluminação do salão de recreio é adequada."
        name="recreio_iluminacao"
        value={data.recreio_iluminacao || ""}
        onChange={handleChange("recreio_iluminacao")}
        options={likertOptions}
        hasError={errors.includes("recreio_iluminacao")}
      />

      <SelectQuestion
        question="Para análise das condições do rancho, informar a localização do rancho:"
        name="rancho_localizacao"
        value={data.rancho_localizacao || ""}
        onChange={handleChange("rancho_localizacao")}
        options={ranchoOptions}
        placeholder="Selecione um rancho"
        hasError={errors.includes("rancho_localizacao")}
      />

      <Question
        questionNumber={23}
        question="Estou satisfeito com a qualidade da comida servida no rancho."
        name="rancho_qualidade_comida"
        value={data.rancho_qualidade_comida || ""}
        onChange={handleChange("rancho_qualidade_comida")}
        options={likertOptions}
        hasError={errors.includes("rancho_qualidade_comida")}
      />

      <Question
        questionNumber={24}
        question="O mobiliário do rancho está em boas condições de preservação e limpeza."
        name="rancho_mobiliario_condicao"
        value={data.rancho_mobiliario_condicao || ""}
        onChange={handleChange("rancho_mobiliario_condicao")}
        options={likertOptions}
        hasError={errors.includes("rancho_mobiliario_condicao")}
      />

      <Question
        questionNumber={25}
        question="A limpeza do rancho é adequada."
        name="rancho_limpeza"
        value={data.rancho_limpeza || ""}
        onChange={handleChange("rancho_limpeza")}
        options={likertOptions}
        hasError={errors.includes("rancho_limpeza")}
      />

      <Question
        questionNumber={26}
        question="A temperatura do rancho é adequada."
        name="rancho_temperatura"
        value={data.rancho_temperatura || ""}
        onChange={handleChange("rancho_temperatura")}
        options={likertOptions}
        hasError={errors.includes("rancho_temperatura")}
      />

      <Question
        questionNumber={27}
        question="A iluminação do rancho é adequada."
        name="rancho_iluminacao"
        value={data.rancho_iluminacao || ""}
        onChange={handleChange("rancho_iluminacao")}
        options={likertOptions}
        hasError={errors.includes("rancho_iluminacao")}
      />

      <SelectQuestion
        question="Para análise das condições da escala de serviço, informar sua escala:"
        name="escala_servico_tipo"
        value={data.escala_servico_tipo || ""}
        onChange={handleChange("escala_servico_tipo")}
        options={escalaOptions}
        placeholder="Selecione uma escala"
        hasError={errors.includes("escala_servico_tipo")}
      />

      <Question
        questionNumber={28}
        question="Quando estou de serviço, percebo que os equipamentos utilizados estão em boas condições."
        name="escala_equipamentos_condicao"
        value={data.escala_equipamentos_condicao || ""}
        onChange={handleChange("escala_equipamentos_condicao")}
        options={likertOptions}
        hasError={errors.includes("escala_equipamentos_condicao")}
      />

      <Question
        questionNumber={29}
        question="Quando estou de serviço, as instalações de pernoite são adequadas."
        name="escala_pernoite_adequada"
        value={data.escala_pernoite_adequada || ""}
        onChange={handleChange("escala_pernoite_adequada")}
        options={likertOptions}
        hasError={errors.includes("escala_pernoite_adequada")}
      />

      <Question
        questionNumber={36}
        question="Participo com regularidade do Treinamento Físico Militar."
        name="tfm_participa_regularmente"
        value={data.tfm_participa_regularmente || ""}
        onChange={handleChange("tfm_participa_regularmente")}
        options={likertOptions}
        hasError={errors.includes("tfm_participa_regularmente")}
      />

      <Question
        questionNumber={37}
        question="É incentivada a prática de Treinamento Físico Militar."
        name="tfm_incentivo_pratica"
        value={data.tfm_incentivo_pratica || ""}
        onChange={handleChange("tfm_incentivo_pratica")}
        options={likertOptions}
        hasError={errors.includes("tfm_incentivo_pratica")}
      />

      <Question
        questionNumber={38}
        question="Considero as instalações para a prática de Treinamento Físico Militar adequadas."
        name="tfm_instalacoes_adequadas"
        value={data.tfm_instalacoes_adequadas || ""}
        onChange={handleChange("tfm_instalacoes_adequadas")}
        options={likertOptions}
        hasError={errors.includes("tfm_instalacoes_adequadas")}
      />
    </div>
  );
}