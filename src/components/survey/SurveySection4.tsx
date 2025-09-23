import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, CheckCircle2 } from "lucide-react";

interface SurveySection4Props {
  data: any;
  onUpdate: (data: any) => void;
  errors?: string[];
}

export function SurveySection4({ data, onUpdate, errors = [] }: SurveySection4Props) {
  const handleChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const questions = [
    {
      id: "aspecto_positivo",
      question: "Aspecto positivo da OM que gostaria de destacar:",
      placeholder: "Descreva os aspectos positivos que você observa na organização..."
    },
    {
      id: "aspecto_negativo", 
      question: "Aspecto negativo da OM que gostaria que fosse solucionado:",
      placeholder: "Descreva os aspectos que considera necessário melhorar..."
    },
    {
      id: "proposta_processo",
      question: "Você tem alguma ideia/proposta para melhorar algum processo da OM?",
      placeholder: "Compartilhe suas ideias para melhorar os processos organizacionais..."
    },
    {
      id: "proposta_satisfacao",
      question: "Você tem alguma ideia/proposta para melhorar a satisfação e motivação da tripulação?",
      placeholder: "Sugira ações para aumentar a satisfação e motivação dos militares..."
    }
  ];

  return (
    <div className="space-y-8">
      {questions.map((question, index) => {
        const hasError = errors.includes(question.id);
        const questionNumber = index + 1;
        
        return (
          <div 
            key={question.id}
            id={`question-${question.id}`}
            className={`question-card p-8 mb-8 fade-in ${
              hasError ? 'question-card-error' : ''
            }`}
          >
            {hasError && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-destructive text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Esta pergunta é obrigatória
                </p>
              </div>
            )}
            
            <div className="flex items-start gap-6 mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
                hasError 
                  ? 'bg-destructive text-white' 
                  : 'bg-gradient-primary text-white'
              }`}>
                <span className="font-bold text-lg">{questionNumber}</span>
              </div>
              <div className="flex-1">
                <Label className={`text-base md:text-lg font-semibold leading-relaxed block mb-6 ${
                  hasError ? 'text-destructive' : 'text-slate-800'
                }`}>
                  {question.question}
                </Label>
                
                <div className="relative">
                  <Textarea
                    value={data[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    className={`min-h-[120px] text-base resize-none transition-all duration-200 ${
                      hasError 
                        ? 'border-destructive focus:border-destructive' 
                        : 'border-slate-300 focus:border-primary'
                    } ${data[question.id] ? 'bg-primary/5 border-primary/30' : 'bg-background'}`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                  {data[question.id] && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}