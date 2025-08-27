import React from 'react';

const RegistrationStepper = ({ currentStep, steps }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (stepIndex, status) => {
    const stepNumber = stepIndex + 1;
    
    if (status === 'completed') {
      return (
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    if (status === 'active') {
      return (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-200">
          <span className="text-sm font-medium text-white">{stepNumber}</span>
        </div>
      );
    }
    
    return (
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
        <span className="text-sm font-medium text-gray-500">{stepNumber}</span>
      </div>
    );
  };

  const getStepTitleColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-gray-900';
      case 'active':
        return 'text-gray-900';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStepStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'active':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStepStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  const getConnectorColor = (stepIndex) => {
    if (stepIndex < currentStep - 1) {
      return 'bg-green-600'; // Completed connector
    } else if (stepIndex === currentStep - 1) {
      return 'bg-gradient-to-r from-blue-600 to-gray-300'; // Active to pending connector
    }
    return 'bg-gray-300'; // Pending connector
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                {/* Step Icon */}
                <div className="mb-3">
                  {getStepIcon(index, status)}
                </div>
                
                {/* Step Title */}
                <h3 className={`text-sm font-semibold mb-1 ${getStepTitleColor(status)}`}>
                  {step.title}
                </h3>
                
                {/* Step Status */}
                <p className={`text-xs ${getStepStatusColor(status)}`}>
                  {getStepStatusText(status)}
                </p>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div className={`h-0.5 ${getConnectorColor(index)}`}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationStepper;
