import React, { useState } from 'react';

import { Button } from '../../buttons/Button';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { VStack } from '../../layout';
import { Text } from '../../typography/Text';
import { Tray } from '../tray/Tray';

export const TrayPreventDismissScreen = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);

  return (
    <ExampleScreen>
      <Example title="Prevent Dismiss Tray">
        <Button onPress={() => setIsTrayVisible(true)}>Open</Button>
        {isTrayVisible && (
          <Tray
            preventDismissGestures
            onCloseComplete={() => setIsTrayVisible(false)}
            title="Non-Dismissible Tray"
          >
            {({ handleClose }) => (
              <VStack gap={2} padding={3}>
                <Text>
                  This tray cannot be dismissed by swiping down or tapping outside. You must use the
                  button below to close it.
                </Text>
                <Button onPress={handleClose}>Close Tray</Button>
              </VStack>
            )}
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export default TrayPreventDismissScreen;
