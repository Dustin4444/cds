import React, { useCallback, useRef, useState } from 'react';
import { Image } from 'react-native';

import { Button } from '../../buttons/Button';
import { IconButton } from '../../buttons/IconButton';
import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { Pictogram } from '../../illustrations/Pictogram';
import { Box, HStack, VStack } from '../../layout';
import { Text } from '../../typography/Text';
import type { DrawerRefBaseProps } from '../drawer/Drawer';
import { Tray } from '../tray/Tray';

export const TrayWithHeaderRenderFunction = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);
  const trayRef = useRef<DrawerRefBaseProps>(null);

  return (
    <ExampleScreen>
      <Example title="Tray with Header Render Function">
        <Button onPress={() => setIsTrayVisible(true)}>Open Tray</Button>
        {isTrayVisible && (
          <Tray
            ref={trayRef}
            hideHeader
            header={({ handleClose }) => (
              <HStack alignItems="center" paddingTop={2} paddingX={2}>
                <IconButton transparent name="backArrow" onPress={handleClose} />
                <Text font="headline" paddingStart={2}>
                  Back Arrow Header
                </Text>
              </HStack>
            )}
            onCloseComplete={() => setIsTrayVisible(false)}
          >
            {({ handleClose }) => (
              <VStack gap={2} padding={3}>
                <Text>
                  This tray uses a render function for the header prop, giving access to handleClose
                  for the back arrow button.
                </Text>
                <Button onPress={handleClose}>Done</Button>
              </VStack>
            )}
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export const TrayWithFooterRenderFunction = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);

  return (
    <ExampleScreen>
      <Example title="Tray with Footer Render Function">
        <Button onPress={() => setIsTrayVisible(true)}>Open Tray</Button>
        {isTrayVisible && (
          <Tray
            footer={({ handleClose }) => (
              <HStack gap={2} padding={3}>
                <Button flexGrow={1} onPress={handleClose} variant="secondary">
                  Cancel
                </Button>
                <Button flexGrow={1} onPress={handleClose}>
                  Confirm
                </Button>
              </HStack>
            )}
            onCloseComplete={() => setIsTrayVisible(false)}
            title="Confirm Action"
          >
            <VStack gap={2} padding={3}>
              <Text>
                This tray uses a render function for the footer prop, giving access to handleClose
                for the action buttons.
              </Text>
            </VStack>
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export const TrayWithPictogramTitle = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);

  return (
    <ExampleScreen>
      <Example title="Tray with Pictogram Title">
        <Button onPress={() => setIsTrayVisible(true)}>Open Tray</Button>
        {isTrayVisible && (
          <Tray
            onCloseComplete={() => setIsTrayVisible(false)}
            title={
              <VStack gap={2} paddingTop={3} paddingX={3}>
                <Pictogram name="addWallet" />
                <Text font="title3">Add Wallet</Text>
              </VStack>
            }
          >
            {({ handleClose }) => (
              <VStack gap={2} padding={3}>
                <Text>This tray has a custom title with a pictogram illustration.</Text>
                <Button onPress={handleClose}>Close</Button>
              </VStack>
            )}
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export const TrayWithImageHeader = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);

  return (
    <ExampleScreen>
      <Example title="Tray with Image Header">
        <Button onPress={() => setIsTrayVisible(true)}>Open Tray</Button>
        {isTrayVisible && (
          <Tray
            header={
              <Box height={180} width="100%">
                <Image
                  resizeMode="cover"
                  source={{
                    uri: 'https://images.ctfassets.net/o10es7wu5gm1/4BsskcYybNIDMYTeMpkFPG/216eb97727f834346649004a5d66cd3f/Coinbase_Press_Page_Product_Image.png',
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
            }
            onCloseComplete={() => setIsTrayVisible(false)}
          >
            {({ handleClose }) => (
              <VStack gap={2} padding={3}>
                <Text font="title3">Featured Content</Text>
                <Text>This tray has a custom image header.</Text>
                <Button onPress={handleClose}>Close</Button>
              </VStack>
            )}
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export const TrayWithHideHeader = () => {
  const [isTrayVisible, setIsTrayVisible] = useState(false);

  return (
    <ExampleScreen>
      <Example title="Tray with hideHeader">
        <Button onPress={() => setIsTrayVisible(true)}>Open Tray</Button>
        {isTrayVisible && (
          <Tray
            hideHeader
            onCloseComplete={() => setIsTrayVisible(false)}
            title="This title is hidden"
          >
            {({ handleClose }) => (
              <VStack gap={2} padding={3}>
                <Text font="title3">Custom Content Only</Text>
                <Text>
                  This tray uses hideHeader to remove the default title section. You can provide
                  your own header content using the header prop.
                </Text>
                <Button onPress={handleClose}>Close</Button>
              </VStack>
            )}
          </Tray>
        )}
      </Example>
    </ExampleScreen>
  );
};

export default TrayWithFooterRenderFunction;
