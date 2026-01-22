import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { prices } from '@coinbase/cds-common/internal/data/prices';

import { Button } from '../../buttons/Button';
import { Menu } from '../../controls/Menu';
import { SelectOption } from '../../controls/SelectOption';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { HStack, VStack } from '../../layout';
import { Text } from '../../typography/Text';
import { Tray } from '../tray/Tray';

const lotsOfOptions: string[] = prices.slice(0, 20);

export const TrayWithFooterScreen = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);
  const [value, setValue] = useState<string>();

  return (
    <ExampleScreen>
      <Example title="Tray with Footer">
        <Button onPress={() => setIsTrayVisible(true)}>Open</Button>
        {isTrayVisible && (
          <Tray
            disableCapturePanGestureToDismiss
            footer={({ handleClose }) => (
              <HStack borderedTop gap={2} padding={3}>
                <Button flexGrow={1} onPress={handleClose} variant="secondary">
                  Cancel
                </Button>
                <Button flexGrow={1} onPress={handleClose}>
                  Confirm
                </Button>
              </HStack>
            )}
            onCloseComplete={() => setIsTrayVisible(false)}
            title="Select an Option"
          >
            <Menu onChange={setValue} value={value}>
              <FlatList
                data={lotsOfOptions}
                renderItem={({ item }) => (
                  <SelectOption key={item} description="BTC" title={item} value={item} />
                )}
              />
            </Menu>
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export default TrayWithFooterScreen;
