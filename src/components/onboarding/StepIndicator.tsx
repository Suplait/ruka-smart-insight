
import React from 'react';

type StepProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({
  currentStep,
  totalSteps
}: StepProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({
        length: totalSteps
      }).map((_, index) => (
        <div 
          key={index} 
          className={`h-2.5 rounded-full transition-all duration-300 ${
            index < currentStep 
              ? "w-8 bg-primary" 
              : index === currentStep 
                ? "w-8 bg-primary" 
                : "w-2.5 bg-gray-200"
          }`} 
        />
      ))}
    </div>
  );
};

export default StepIndicator;
