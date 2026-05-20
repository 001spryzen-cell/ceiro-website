import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const steps = [
  "Uploading",
  "Reading PDF",
  "Detecting table",
  "Extracting transactions",
  "Validating balances",
];

type ProgressStepsProps = {
  activeStep: number;
  isRunning: boolean;
};

export function ProgressSteps({ activeStep, isRunning }: ProgressStepsProps) {
  return (
    <div className="grid gap-2">
      {steps.map((step, index) => {
        const isComplete = index < activeStep || (!isRunning && activeStep >= steps.length - 1);
        const isActive = index === activeStep && isRunning;
        return (
          <div
            key={step}
            className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            ) : isActive ? (
              <Loader2 className="h-4 w-4 animate-spin text-sky-600" aria-hidden="true" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />
            )}
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
