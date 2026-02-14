import { memo } from 'react';
import { IconButton } from '@coinbase/cds-web/buttons/IconButton';
import { Box } from '@coinbase/cds-web/layout';
import { HStack } from '@coinbase/cds-web/layout/HStack';
import { PeriodSelector } from '@coinbase/cds-web-visualization/chart';

type TabItem = { id: string; label: string };

type PeriodSelectorWrapperProps = {
  activeTab: TabItem;
  setActiveTab: (tab: TabItem) => void;
  tabs: TabItem[];
  onClickSettings: () => void;
};

export const PeriodSelectorWrapper = memo(function PeriodSelectorWrapper({
  activeTab,
  setActiveTab,
  tabs,
  onClickSettings,
}: PeriodSelectorWrapperProps) {
  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      maxWidth="100%"
      overflow="hidden"
      width="100%"
    >
      <Box flexGrow={1} overflow="hidden" position="relative">
        <style>{`
          .scrollContainer {
            scrollbar-width: none;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-x;

            &::-webkit-scrollbar {
              display: none;
            }
          }
        `}</style>
        <Box className="scrollContainer" paddingEnd={2}>
          <PeriodSelector
            activeTab={activeTab}
            gap={1}
            justifyContent="flex-start"
            onChange={setActiveTab}
            tabs={tabs}
            width="fit-content"
          />
        </Box>
        <Box
          position="absolute"
          style={{
            background: 'linear-gradient(to left, var(--color-bg), transparent 100%)',
            right: 0,
            bottom: 0,
            top: 0,
            width: 'var(--space-4)',
            pointerEvents: 'none',
          }}
        />
      </Box>
      <IconButton
        compact
        accessibilityLabel="Chart settings"
        flexShrink={0}
        height={36}
        name="settings"
        onClick={onClickSettings}
        variant="secondary"
      />
    </HStack>
  );
});
