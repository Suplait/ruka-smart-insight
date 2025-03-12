
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full flex-1 mx-1 transition-all ${
            index <= currentStep ? "bg-primary" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
