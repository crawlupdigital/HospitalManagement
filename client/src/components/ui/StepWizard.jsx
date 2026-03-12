import React from 'react';
import { CheckCircle } from 'lucide-react';

const StepWizard = ({ steps, currentStep, children }) => {
  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center mb-6">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${i < currentStep ? 'bg-green-500 text-white' : 
                  i === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                  'bg-gray-200 text-gray-500'}`}
              >
                {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline
                ${i === currentStep ? 'text-blue-700' : i < currentStep ? 'text-green-700' : 'text-gray-400'}`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < currentStep ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div>{children}</div>
    </div>
  );
};

export default StepWizard;
