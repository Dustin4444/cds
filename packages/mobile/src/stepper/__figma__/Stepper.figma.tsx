import { Stepper } from '@coinbase/cds-mobile/stepper';
import { figma } from '@figma/code-connect';

const FIGMA_URL =
  'https://www.figma.com/design/k5CtyJccNQUGMI5bI4lJ2g/%E2%9C%A8-CDS-Components?node-id=54927-8503&m=dev';

const steps = [
  { id: 'step-1', label: 'Title' },
  { id: 'step-2', label: 'Title' },
  { id: 'step-3', label: 'Title' },
];

figma.connect(Stepper, FIGMA_URL, {
  variant: { type: 'stepper', platform: '📱 mobile' },
  imports: ["import { Stepper } from '@coinbase/cds-mobile/stepper'"],
  example: () => (
    <Stepper activeStepId="step-2" direction="horizontal" steps={steps.map((s) => ({ ...s }))} />
  ),
});

figma.connect(Stepper, FIGMA_URL, {
  variant: { type: 'progressor', platform: '📱 mobile' },
  imports: ["import { Stepper } from '@coinbase/cds-mobile/stepper'"],
  example: () => (
    <Stepper
      StepperHeaderComponent={null}
      StepperLabelComponent={null}
      activeStepId="step-2"
      direction="horizontal"
      steps={steps.map((s) => ({ ...s }))}
    />
  ),
});
