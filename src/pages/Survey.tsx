import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ClipboardList, ArrowRight, ArrowLeft, Anchor, Shield, Star, Waves, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SurveySection1 } from "@/components/survey/SurveySection1";
import { SurveySection2 } from "@/components/survey/SurveySection2";
import { SurveySection3 } from "@/components/survey/SurveySection3";
import { SurveySection4 } from "@/components/survey/SurveySection4";
import { SuccessMessage } from "@/components/survey/SuccessMessage";

type SurveyData = {
  // Section 1
  setor_trabalho: string;
  materiais_fornecidos: string;
  materiais_adequados: string;
  atendimento_apoio: string;
  limpeza_adequada: string;
  temperatura_adequada: string;
  iluminacao_adequada: string;
  localizacao_alojamento: string;
  alojamento_condicoes: string;
  banheiros_adequados: string;
  praca_darmas_adequada: string;
  localizacao_rancho: string;
  rancho_instalacoes: string;
  rancho_qualidade: string;
  escala_servico: string;
  escala_atrapalha: string;
  equipamentos_servico: string;
  tfm_participa: string;
  tfm_incentivado: string;
  tfm_instalacoes: string;
  // Section 2
  chefe_ouve_ideias: string;
  chefe_se_importa: string;
  contribuir_atividades: string;
  chefe_delega: string;
  pares_auxiliam: string;
  entrosamento_setores: string;
  entrosamento_tripulacao: string;
  convivio_agradavel: string;
  confianca_respeito: string;
  // Section 3
  feedback_desempenho: string;
  conceito_compativel: string;
  importancia_atividade: string;
  trabalho_reconhecido: string;
  crescimento_estimulado: string;
  cursos_suficientes: string;
  programa_treinamento: string;
  orgulho_trabalhar: string;
  bem_aproveitado: string;
  potencial_outra_funcao: string;
  carga_trabalho_justa: string;
  licenca_autorizada: string;
  // Section 4
  aspecto_positivo: string;
  aspecto_negativo: string;
  proposta_processo: string;
  proposta_satisfacao: string;
};

export default function Survey() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const totalSections = 4;
  const progress = ((currentSection + 1) / totalSections) * 100;

  const sectionData = [
    {
      title: "Condições do Ambiente",
      icon: Anchor,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      title: "Relacionamento",
      icon: Shield,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    },
    {
      title: "Motivação & Desenvolvimento",
      icon: Star,
      color: "text-naval-gold",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20"
    },
    {
      title: "Comentários & Sugestões",
      icon: BarChart3,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    }
  ];

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
  };

  const handleNextSection = () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setValidationErrors(missingFields);
      // Scroll para a primeira pergunta com erro
      setTimeout(() => {
        const firstErrorElement = document.getElementById(`question-${missingFields[0]}`);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add micro-feedback for error
          firstErrorElement.classList.add('micro-bounce');
          setTimeout(() => firstErrorElement.classList.remove('micro-bounce'), 400);
        }
      }, 100);
      return;
    }
    
    setValidationErrors([]);
    if (currentSection < totalSections - 1) {
      // Celebrar conclusão da seção
      const currentElement = document.querySelector('.section-indicator-active');
      if (currentElement) {
        currentElement.classList.add('pulse-success');
        setTimeout(() => currentElement.classList.remove('pulse-success'), 600);
      }
      
      // Transição suave para próxima seção
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        // Auto-scroll para o topo da nova seção
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setValidationErrors(missingFields);
      // Scroll para a primeira pergunta com erro
      setTimeout(() => {
        const firstErrorElement = document.getElementById(`question-${missingFields[0]}`);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log("Survey submitted:", surveyData);
    }, 2000);
  };

  const getMissingFields = () => {
    // Campos sempre obrigatórios da seção 1
    const section1BaseFields = [
      'setor_trabalho', 'materiais_fornecidos', 'materiais_adequados', 'atendimento_apoio',
      'limpeza_adequada', 'temperatura_adequada', 'iluminacao_adequada', 'localizacao_alojamento',
      'localizacao_rancho', 'escala_servico'
    ];

    // Campos condicionais da seção 1
    const section1ConditionalFields = [];
    
    // Q9-Q10 dependem de Q8 (alojamento)
    if (surveyData.localizacao_alojamento) {
      section1ConditionalFields.push('alojamento_condicoes', 'banheiros_adequados');
    }
    
    // Q11, Q13-Q14 dependem de Q12 (rancho)
    if (surveyData.localizacao_rancho) {
      // Q12 (Praça D'armas) só é obrigatória quando rancho for "Praça D'armas"
      if (surveyData.localizacao_rancho === "Praça D'armas") {
        section1ConditionalFields.push('praca_darmas_adequada');
      }
      section1ConditionalFields.push('rancho_instalacoes', 'rancho_qualidade');
    }
    
    // Q16-Q20 dependem de Q15 (escala)
    if (surveyData.escala_servico) {
      section1ConditionalFields.push('escala_atrapalha', 'equipamentos_servico', 'tfm_participa', 'tfm_incentivado', 'tfm_instalacoes');
    }

    const section1Fields = [...section1BaseFields, ...section1ConditionalFields];
    
    const section2Fields = [
      'chefe_ouve_ideias', 'chefe_se_importa', 'contribuir_atividades', 'chefe_delega',
      'pares_auxiliam', 'entrosamento_setores', 'entrosamento_tripulacao', 'convivio_agradavel',
      'confianca_respeito'
    ];
    
    const section3Fields = [
      'feedback_desempenho', 'conceito_compativel', 'importancia_atividade', 'trabalho_reconhecido',
      'crescimento_estimulado', 'cursos_suficientes', 'programa_treinamento', 'orgulho_trabalhar',
      'bem_aproveitado', 'potencial_outra_funcao', 'carga_trabalho_justa', 'licenca_autorizada'
    ];
    
    const section4Fields = [
      'aspecto_positivo', 'aspecto_negativo', 'proposta_processo', 'proposta_satisfacao'
    ];

    const sectionFields = [section1Fields, section2Fields, section3Fields, section4Fields];
    const requiredFields = sectionFields[currentSection];
    
    return requiredFields.filter(field => !surveyData[field as keyof SurveyData]);
  };

  const isCurrentSectionComplete = () => {
    // Usar a mesma lógica condicional do getMissingFields
    return getMissingFields().length === 0;
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return <SurveySection1 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      case 1:
        return <SurveySection2 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      case 2:
        return <SurveySection3 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      case 3:
        return <SurveySection4 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  const currentSectionData = sectionData[currentSection];
  const IconComponent = currentSectionData.icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">
        
        {/* Modern Header */}
        <div className="text-center space-y-8 py-8 fade-in">            
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
                  alt="Brasão PAPEM" 
                  className="w-28 h-28 object-contain floating-element"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Pesquisa de Clima Organizacional
              </h1>
              
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 shadow-lg max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src="/lovable-uploads/a27f9473-5787-4cab-9c01-3f62a66a5e88.png" 
                      alt="Mascote PAPEM" 
                      className="w-20 h-24 object-contain animate-bounce-slow"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-2xl">🔒</span>
                      <h2 className="text-xl font-bold text-primary">Pesquisa 100% Anônima e Confidencial</h2>
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Sua participação é fundamental para o <span className="font-semibold text-foreground">aprimoramento e melhoria da nossa OM</span>.
                      <br />
                      Responda com <span className="font-semibold text-primary">objetividade e precisão</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="survey-card-enhanced p-8 slide-up w-full mx-auto">
          <div className="space-y-4">
            {/* Progress Info */}
            <div className="flex justify-between items-center text-sm text-foreground mb-2">
              <span className="font-medium">Seção {currentSection + 1} de {totalSections}</span>
              <div className="text-right">
                <span className="font-semibold text-primary">{Math.round(progress)}% concluído</span>
                <div className="text-xs text-muted-foreground mt-1">
                  ⏱️ ~{Math.max(1, Math.ceil((4 - currentSection - 1) * 2))} min restantes
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="progress-bar-enhanced">
              <div 
                className="progress-fill-enhanced"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
              {/* Progress milestones */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {[25, 50, 75].map((milestone) => (
                  <div 
                    key={milestone}
                    className={`w-1 h-4 rounded-full transition-all duration-300 ${
                      progress >= milestone ? 'bg-white shadow-sm' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Section Indicators */}
            <div className="flex justify-between items-center">
              {sectionData.map((section, index) => {
                const isActive = index === currentSection;
                const isCompleted = index < currentSection;
                
                return (
                  <div key={index} className={`section-indicator-enhanced flex-1 ${
                    isActive ? 'section-indicator-active' : ''
                  }`}>
                    <div className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${isCompleted ? 'micro-bounce' : ''}
                      ${isActive 
                        ? 'border-primary text-primary bg-primary/10 shadow-sm' 
                        : isCompleted
                        ? 'border-success text-white bg-success shadow-sm'
                        : 'border-muted-foreground text-muted-foreground bg-transparent'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-primary' 
                        : isCompleted
                        ? 'text-success'
                        : 'text-muted-foreground'
                    }`}>
                      {section.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modern Section Title */}
        <div className="text-center space-y-4 fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20">
            <IconComponent className="w-6 h-6 text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {currentSection === 0 && `${currentSection + 1}. Condições de Trabalho, Serviço e TFM`}
                {currentSection === 1 && `${currentSection + 1}. Relacionamento`}
                {currentSection === 2 && `${currentSection + 1}. Motivação e Desenvolvimento Profissional`}
                {currentSection === 3 && `${currentSection + 1}. Comentários e Sugestões`}
              </h2>
              <p className="text-sm text-primary/70 font-medium mt-1">
                {currentSection === 0 && "20 perguntas"}
                {currentSection === 1 && "9 perguntas"}
                {currentSection === 2 && "12 perguntas"}
                {currentSection === 3 && "4 perguntas"}
              </p>
            </div>
          </div>
        </div>
        
        {/* Survey Content */}
        <div className="space-y-4 slide-up max-w-4xl mx-auto">
          {renderCurrentSection()}
        </div>

        {/* Enhanced Navigation */}
        <div className="survey-card-enhanced p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className="modern-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Seção Anterior
            </Button>

            {currentSection === totalSections - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="modern-button bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enviar Pesquisa
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNextSection}
                className="modern-button"
              >
                Próxima Seção
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}