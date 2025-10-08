import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ClipboardList, ArrowRight, ArrowLeft, Anchor, Shield, Star, Waves, BarChart3, Save, Info } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SurveySection1 } from "@/components/survey/SurveySection1";
import { SurveySection2 } from "@/components/survey/SurveySection2";
import { SurveySection3 } from "@/components/survey/SurveySection3";
import { SurveySection4 } from "@/components/survey/SurveySection4";
import { SuccessMessage } from "@/components/survey/SuccessMessage";

type SurveyData = {
  // Section 1 - Condições do ambiente / conforto
  setor_localizacao: string;
  setor_computadores: string;
  setor_mobiliario: string;
  setor_limpeza: string;
  setor_temperatura: string;
  setor_iluminacao: string;
  alojamento_localizacao: string;
  alojamento_limpeza: string;
  alojamento_temperatura: string;
  alojamento_iluminacao: string;
  alojamento_armarios_condicao: string;
  alojamento_armario_preservado: string;
  banheiro_localizacao: string;
  banheiro_vasos_suficientes: string;
  banheiro_vasos_preservados: string;
  banheiro_torneiras_funcionam: string;
  banheiro_chuveiros_suficientes: string;
  banheiro_chuveiros_funcionam: string;
  banheiro_limpeza: string;
  banheiro_iluminacao: string;
  recreio_localizacao: string;
  recreio_mobiliario_quantidade: string;
  recreio_mobiliario_condicao: string;
  recreio_limpeza: string;
  recreio_temperatura: string;
  recreio_iluminacao: string;
  rancho_localizacao: string;
  rancho_qualidade_comida: string;
  rancho_mobiliario_condicao: string;
  rancho_limpeza: string;
  rancho_temperatura: string;
  rancho_iluminacao: string;
  escala_servico_tipo: string;
  escala_equipamentos_condicao: string;
  escala_pernoite_adequada: string;
  tfm_participa_regularmente: string;
  tfm_incentivo_pratica: string;
  tfm_instalacoes_adequadas: string;
  // Section 2 - Relacionamento
  encarregado_ouve_melhorias: string;
  encarregado_fornece_meios: string;
  disposicao_contribuir_setor: string;
  encarregado_delega: string;
  pares_auxiliam_setor: string;
  relacionamento_intersetorial: string;
  entrosamento_tripulacao: string;
  convivencia_regras: string;
  confianca_respeito_relacoes: string;
  integracao_familia_papem: string;
  // Section 3 - Motivação / Desenvolvimento
  feedback_desempenho_regular: string;
  conceito_compativel_desempenho: string;
  importancia_funcao_papem: string;
  trabalho_reconhecido_valorizado: string;
  crescimento_profissional_estimulado: string;
  cursos_suficientes_atividade: string;
  programa_adestramento_regular: string;
  orgulho_trabalhar_papem: string;
  atuacao_area_especializacao: string;
  potencial_melhor_em_outra_funcao: string;
  carga_trabalho_justa: string;
  licenca_autorizada_sem_prejuizo: string;
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState(true);

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

  // Auto-save functionality
  useEffect(() => {
    // Load saved data on mount
    const savedData = localStorage.getItem('papem-survey-data');
    const savedSection = localStorage.getItem('papem-survey-section');
    if (savedData) {
      setSurveyData(JSON.parse(savedData));
    }
    if (savedSection) {
      setCurrentSection(parseInt(savedSection));
    }
  }, []);

  // Auto-save data whenever it changes
  useEffect(() => {
    if (Object.keys(surveyData).length > 0) {
      localStorage.setItem('papem-survey-data', JSON.stringify(surveyData));
      localStorage.setItem('papem-survey-section', currentSection.toString());
      setLastSaved(new Date());
    }
  }, [surveyData, currentSection]);

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
    
    try {
      // Submit to backend API
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        console.log("Survey submitted successfully:", result);
        
        // Clear saved data after successful submission
        localStorage.removeItem('papem-survey-data');
        localStorage.removeItem('papem-survey-section');
        setLastSaved(null);
      } else {
        throw new Error(result.message || 'Erro ao enviar pesquisa');
      }
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error);
      alert('Erro ao enviar pesquisa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMissingFields = () => {
    const section1Fields = [
      'setor_localizacao', 'setor_computadores', 'setor_mobiliario', 'setor_limpeza', 'setor_temperatura', 'setor_iluminacao',
      'alojamento_localizacao', 'alojamento_limpeza', 'alojamento_temperatura', 'alojamento_iluminacao', 'alojamento_armarios_condicao', 'alojamento_armario_preservado',
      'banheiro_localizacao', 'banheiro_vasos_suficientes', 'banheiro_vasos_preservados', 'banheiro_torneiras_funcionam',
      'banheiro_chuveiros_suficientes', 'banheiro_chuveiros_funcionam', 'banheiro_limpeza', 'banheiro_iluminacao',
      'recreio_localizacao', 'recreio_mobiliario_quantidade', 'recreio_mobiliario_condicao', 'recreio_limpeza', 'recreio_temperatura', 'recreio_iluminacao',
      'rancho_localizacao', 'rancho_qualidade_comida', 'rancho_mobiliario_condicao', 'rancho_limpeza', 'rancho_temperatura', 'rancho_iluminacao',
      'escala_servico_tipo', 'escala_equipamentos_condicao', 'escala_pernoite_adequada',
      'tfm_participa_regularmente', 'tfm_incentivo_pratica', 'tfm_instalacoes_adequadas'
    ];

    const section2Fields = [
      'encarregado_ouve_melhorias', 'encarregado_fornece_meios', 'disposicao_contribuir_setor', 'encarregado_delega',
      'pares_auxiliam_setor', 'relacionamento_intersetorial', 'entrosamento_tripulacao', 'convivencia_regras',
      'confianca_respeito_relacoes', 'integracao_familia_papem'
    ];

    const section3Fields = [
      'feedback_desempenho_regular', 'conceito_compativel_desempenho', 'importancia_funcao_papem', 'trabalho_reconhecido_valorizado',
      'crescimento_profissional_estimulado', 'cursos_suficientes_atividade', 'programa_adestramento_regular', 'orgulho_trabalhar_papem',
      'atuacao_area_especializacao', 'potencial_melhor_em_outra_funcao', 'carga_trabalho_justa', 'licenca_autorizada_sem_prejuizo'
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
              <div className="flex items-center gap-3">
                <span className="font-medium">Seção {currentSection + 1} de {totalSections}</span>
                
                {/* Auto-save indicator */}
                {lastSaved && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 floating-feedback">
                    <Save className="w-3 h-3" />
                    <span>Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                
                {/* Contextual hint */}
                {showHint && currentSection === 0 && (
                  <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
                       onClick={() => setShowHint(false)}>
                    <Info className="w-3 h-3" />
                    <span>Suas respostas são salvas automaticamente</span>
                  </div>
                )}
              </div>
              
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
                {currentSection === 0 && "32 perguntas"}
                {currentSection === 1 && "10 perguntas"}
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