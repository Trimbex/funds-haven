// app/register/SignupWizard.tsx
'use client';
import { useState } from 'react';
import Step1About from './(steps)/Step1About';
import Step2Account from './(steps)/Step2Verify';
import Step3Account from './(steps)/Step3Account';

export default function SignupWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    <Step1About key={1} next={next} />,
    <Step2Account key={2} next={next} back={back} />,
    <Step3Account key={3} next={next} />,
  ];

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="mx-auto mt-12">
      {steps[currentStepIndex]}
    </div>
  );
}