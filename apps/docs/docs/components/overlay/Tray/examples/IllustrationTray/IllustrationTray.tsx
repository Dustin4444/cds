import React, { useId } from 'react';
import type { PictogramName } from '@coinbase/cds-common';
import { Pictogram } from '@coinbase/cds-web/illustrations/Pictogram';
import { VStack } from '@coinbase/cds-web/layout/VStack';
import { Tray, type TrayProps } from '@coinbase/cds-web/overlays';
import { Text } from '@coinbase/cds-web/typography/Text';

type IllustrationTrayProps = TrayProps & {
  pictogramName: PictogramName;
  title: string;
  children: React.ReactNode;
  [key: string]: unknown;
};

export function IllustrationTray({
  pictogramName,
  title,
  children,
  ...props
}: IllustrationTrayProps) {
  const titleId = useId();

  return (
    <Tray
      {...props}
      accessibilityLabelledBy={titleId}
      title={
        <VStack gap={{ phone: 1.5, tablet: 2, desktop: 2 }}>
          <Pictogram name={pictogramName} />
          <Text font="title3" id={titleId}>
            {title}
          </Text>
        </VStack>
      }
    >
      {children}
    </Tray>
  );
}
