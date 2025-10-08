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
      className={`question-card-enhanced p-3 mb-2 fade-in ${
        hasError ? 'question-card-error border-destructive/40' : ''
      }`}
    >
      {hasError && (
        <div className="mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Esta pergunta é obrigatória
          </p>
        </div>
      )}

      <div className="flex items-start gap-2.5 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
          hasError
            ? 'bg-destructive text-white'
            : 'bg-gradient-primary text-white'
        }`}>
          {questionNumber ? (
            <span className="font-bold text-sm">{questionNumber}</span>
          ) : (
            <Building2 className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <Label className={`text-xs sm:text-sm font-semibold leading-snug block ${
            hasError ? 'text-destructive' : 'text-slate-800'
          }`}>
            {question}
          </Label>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full max-w-3xl">
          {options.map((option, index) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(option.value);
                  }
                }}
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${option.label} ${isSelected ? '(selecionado)' : ''}`}
                className={`
                  option-button-enhanced text-center min-h-[40px] flex items-center justify-center
                  ${isSelected ? 'option-button-selected-enhanced pulse-success' : 'option-button-unselected-enhanced'}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span className="font-medium leading-tight text-xs sm:text-sm">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}