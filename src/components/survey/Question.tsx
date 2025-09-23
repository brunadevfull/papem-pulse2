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
      className={`question-card p-8 mb-8 fade-in ${
        hasError ? 'question-card-error' : ''
      }`}
    >
      {hasError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-destructive text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
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
          {questionNumber ? (
            <span className="font-bold text-lg">{questionNumber}</span>
          ) : (
            <Building2 className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1">
          <Label className={`text-base md:text-lg font-semibold leading-relaxed block ${
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
                  option-button text-center min-h-[60px] flex items-center justify-center
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