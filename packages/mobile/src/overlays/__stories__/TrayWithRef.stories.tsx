import React, { useRef, useState } from 'react';

import { Button } from '../../buttons/Button';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { VStack } from '../../layout';
import { Text } from '../../typography/Text';
import type { DrawerRefBaseProps } from '../drawer/Drawer';
import { Tray } from '../tray/Tray';

export const TrayWithRefScreen = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);
  const trayRef = useRef<DrawerRefBaseProps>(null);

  return (
    <ExampleScreen>
      <Example title="Close With Ref">
        <Button onPress={() => setIsTrayVisible(true)}>Open</Button>
        {isTrayVisible && (
          <Tray
            ref={trayRef}
            preventDismissGestures
            onCloseComplete={() => setIsTrayVisible(false)}
            title="Ref Controlled Tray"
          >
            <VStack gap={2} padding={3}>
              <Text>
                This tray includes a button that closes using the imperative handle on the ref.
              </Text>
              <Button onPress={() => trayRef.current?.handleClose()}>Close Tray</Button>
            </VStack>
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export default TrayWithRefScreen;
