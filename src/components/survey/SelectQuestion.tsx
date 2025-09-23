import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

interface SelectQuestionProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  questionNumber?: number;
}

export function SelectQuestion({ 
  question, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder = "Selecione uma opção",
  required = true, 
  hasError = false, 
  questionNumber 
}: SelectQuestionProps) {
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
          <Label className={`text-base md:text-lg font-semibold leading-relaxed block mb-6 ${
            hasError ? 'text-destructive' : 'text-slate-800'
          }`}>
            {question}
          </Label>
          
          <div className="flex justify-center">
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger 
                className={`w-full max-w-lg h-14 text-lg bg-white/95 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 hover:shadow-md ${
                  hasError 
                    ? 'border-destructive/50 focus:border-destructive' 
                    : 'border-border focus:border-primary hover:border-primary/50'
                }`}
              >
                <SelectValue 
                  placeholder={placeholder}
                  className={`${value ? 'text-slate-800 font-medium' : 'text-muted-foreground'}`}
                />
              </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border border-border shadow-xl rounded-xl">
                {options.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-base py-3 px-4 hover:bg-primary/5 hover:text-slate-800 focus:bg-primary/10 focus:text-slate-800 rounded-lg mx-1 transition-colors duration-200"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}