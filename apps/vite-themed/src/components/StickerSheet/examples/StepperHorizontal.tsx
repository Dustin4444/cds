import { memo, useState } from 'react';
import { useStepper } from '@coinbase/cds-common/stepper/useStepper';
import { Button } from '@coinbase/cds-web/buttons/Button';
import { IconButton } from '@coinbase/cds-web/buttons/IconButton';
import { HStack, VStack } from '@coinbase/cds-web/layout';
import { Stepper, type StepperValue } from '@coinbase/cds-web/stepper/Stepper';

const steps = [
  { id: '1', label: 'Account' },
  { id: '2', label: 'Contact' },
  { id: '3', label: 'Payment' },
  { id: '4', label: 'Review' },
] as const satisfies StepperValue[];

export const StepperHorizontalBasicExample = memo(() => {
  const [stepperState, stepperApi] = useStepper({ steps });
  const [complete, setComplete] = useState(false);

  const handleNext = () => {
    if (stepperState.activeStepId === '4') {
      setComplete(true);
    } else {
      stepperApi.goNextStep();
    }
  };

  const handlePrevious = () => {
    setComplete(false);
    stepperApi.goPreviousStep();
  };

  const handleReset = () => {
    setComplete(false);
    stepperApi.reset();
  };

  return (
    <VStack gap={2} width="100%">
      <Stepper
        activeStepId={stepperState.activeStepId}
        complete={complete}
        direction="horizontal"
        steps={steps}
      />
      <HStack alignSelf="center" gap={1}>
        <IconButton active name="arrowLeft" onClick={handlePrevious} variant="secondary" />
        <IconButton active compact name="arrowRight" onClick={handleNext} variant="secondary" />
        {/* {complete && <Button onClick={handleReset}>Reset</Button>} */}
      </HStack>
    </VStack>
  );
});
