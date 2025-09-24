import { Label } from "@/components/ui/label";
import { Building2, CheckCircle2 } from "lucide-react";

interface QuestionProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  hasError?: boolean;
  questionNumber?: number;
}

export function Question({ question, name, value, onChange, options, required = true, hasError = false, questionNumber }: QuestionProps) {
  return (
    <div 
      id={`question-${name}`}
      className={`question-card p-6 mb-4 fade-in ${
        hasError ? 'question-card-error' : ''
      }`}
    >
      {hasError && (
        <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-destructive text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Esta pergunta é obrigatória
          </p>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
          hasError 
            ? 'bg-destructive text-white' 
            : 'bg-gradient-primary text-white'
        }`}>
          {questionNumber ? (
            <span className="font-bold text-base">{questionNumber}</span>
          ) : (
            <Building2 className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <Label className={`text-sm md:text-base font-semibold leading-snug block ${
            hasError ? 'text-destructive' : 'text-slate-800'
          }`}>
            {question}
          </Label>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
          {options.map((option, index) => {
            const isSelected = value === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`
                  option-button text-center min-h-[50px] flex items-center justify-center
                  ${isSelected ? 'option-button-selected' : 'option-button-unselected'}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  {isSelected && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                  <span className="font-medium leading-tight">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}