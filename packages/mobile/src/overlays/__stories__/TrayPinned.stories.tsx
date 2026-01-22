import React, { useState } from 'react';

import { Button } from '../../buttons/Button';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { HStack, VStack } from '../../layout';
import { Text } from '../../typography/Text';
import { Tray } from '../tray/Tray';

export const TrayPinnedScreen = () => {
  const [pinnedDirection, setPinnedDirection] = useState<
    'bottom' | 'top' | 'left' | 'right' | null
  >(null);

  return (
    <ExampleScreen>
      <Example title="Pin Directions">
        <VStack gap={2}>
          <HStack flexWrap="wrap" gap={1}>
            <Button onPress={() => setPinnedDirection('bottom')}>Bottom</Button>
            <Button onPress={() => setPinnedDirection('top')}>Top</Button>
            <Button onPress={() => setPinnedDirection('left')}>Left</Button>
            <Button onPress={() => setPinnedDirection('right')}>Right</Button>
          </HStack>
          {pinnedDirection && (
            <Tray
              onCloseComplete={() => setPinnedDirection(null)}
              pin={pinnedDirection}
              title={`Pinned ${pinnedDirection}`}
            >
              <VStack gap={2} padding={3}>
                <Text>This tray is pinned to the {pinnedDirection} of the screen.</Text>
                <Text>
                  Side-pinned trays (left/right) are useful for navigation drawers or settings
                  panels.
                </Text>
              </VStack>
            </Tray>
          )}
        </VStack>
      </Example>
    </ExampleScreen>
  );
};

export default TrayPinnedScreen;
