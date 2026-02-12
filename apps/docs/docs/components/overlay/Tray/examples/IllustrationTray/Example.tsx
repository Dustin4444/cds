import { useState } from 'react';
import { Button } from '@coinbase/cds-web/buttons';
import { useBreakpoints } from '@coinbase/cds-web/hooks/useBreakpoints';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { Text } from '@coinbase/cds-web/typography/Text';

import { IllustrationTray } from './IllustrationTray';

export default function Example() {
  const [visible, setVisible] = useState(false);
  const { isPhone } = useBreakpoints();
  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <VStack gap={2}>
      <Button onClick={handleOpen}>Open Illustration Tray</Button>
      {visible && (
        <IllustrationTray
          pictogramName="addWallet"
          title="Section header"
          pin={isPhone ? 'bottom' : 'right'}
          showHandleBar={isPhone}
          onCloseComplete={handleClose}
        >
          <Text color="fgMuted" font="body" paddingBottom={2}>
            Curabitur commodo nulla vel dolor vulputate vestibulum. Nulla et nisl molestie, interdum
            lorem id, viverra.
          </Text>
        </IllustrationTray>
      )}
    </VStack>
  );
}
