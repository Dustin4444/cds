import { memo } from "react";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { IconButton } from "@coinbase/cds-web/buttons/IconButton";
import { Box } from "@coinbase/cds-web/layout/Box";
import { HStack } from "@coinbase/cds-web/layout/HStack";
import { VStack } from "@coinbase/cds-web/layout/VStack";
import { Tag } from "@coinbase/cds-web/tag/Tag";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Link } from "@coinbase/cds-web/typography/Link";
import { useTheme } from "@coinbase/cds-web/hooks/useTheme";
import type { ThemeVars } from "@coinbase/cds-common/core/theme";
import { Avatar } from "@coinbase/cds-web/media/Avatar";
import { Banner } from "@coinbase/cds-web/banner/Banner";
import { InputChip } from "@coinbase/cds-web/chips/InputChip";
import { RemoteImage } from "@coinbase/cds-web/media/RemoteImage";
import { assets } from "@coinbase/cds-common/internal/data/assets";
import { Spinner } from "@coinbase/cds-web/loaders/Spinner";
import { Accordion } from "@coinbase/cds-web/accordion/Accordion";
import { AccordionItem } from "@coinbase/cds-web/accordion/AccordionItem";
import { Pictogram } from "@coinbase/cds-web/illustrations/Pictogram";
import { NudgeCard } from "@coinbase/cds-web/cards/NudgeCard";
import {
  FloatingAssetCard,
  type FloatingAssetCardProps,
} from "@coinbase/cds-web/cards/FloatingAssetCard";
import { ThemeProvider } from "@coinbase/cds-web/system/ThemeProvider";
import type { ThemeConfig } from "@coinbase/cds-web/core/theme";
import {
  avatarSizes,
  bannerVariants,
  borderRadii,
  borderWidths,
  buttonVariants,
  iconSizes,
  space,
  spectrumHues,
  spectrumHueSteps,
  tagColorSchemes,
} from "../../themeVars";
import { StepperHorizontalBasicExample } from "./examples/StepperHorizontal";
import { LineChartBasicExample } from "./examples/LineChart";
import { StepperVerticalCustomExample } from "./examples/StepperVertical";
import { RollingNumberExample } from "./examples/RollingNumber";
import { PaginationExample } from "./examples/Pagination";
import { SelectExample } from "./examples/Select";
import { SelectChipExample } from "./examples/SelectChip";
import { ControlsExample } from "./examples/Controls";
import { SearchExample } from "./examples/Search";
import { TextInputExample } from "./examples/TextInput";
import { DatePickerExample } from "./examples/DatePicker";
import { SegmentedTabsExample } from "./examples/SegmentedTabs";
import { Container } from "./Container";
import { BodyText } from "./BodyText";

const SHOW_DEBUG_BG_COLORS = false;

const floatingAssetCards: FloatingAssetCardProps[] = [
  {
    title: "#7560",
    description: (
      <Text font="label2" as="p" color="fgPositive" numberOfLines={2}>
        &#x2197;14.42%
      </Text>
    ),
    subtitle: "Bored Ape",
    onClick: () => {},
    media: (
      <RemoteImage
        source="/nft_boredape2.png"
        height={"100%"}
        style={{ objectFit: "cover", cursor: "pointer" }}
        width="100%"
      />
    ),
  },
  {
    title: "#2015",
    description: (
      <Text font="label2" as="p" color="fgNegative" numberOfLines={2}>
        &#x2198;6.37%
      </Text>
    ),
    subtitle: "Pudgy Penguins",
    onClick: () => {},
    media: (
      <RemoteImage
        source="/nft_penguin.png"
        height={"100%"}
        style={{ objectFit: "cover", cursor: "pointer" }}
        width="100%"
      />
    ),
  },
];

const rootStyle = {
  position: "relative",
  top: 20,
  maxWidth: 1200,
  padding: 32,
  gap: 16,
  margin: "0 auto",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
} as const;

const leftColumnWidth = 420 as const;
const rightColumnWidth = 600 as const;

export type StickerSheetProps = {
  themeConfig: ThemeConfig;
  showComponents?: boolean;
};

export const StickerSheet = memo(
  ({ themeConfig, showComponents }: StickerSheetProps) => {
    const appTheme = useTheme();
    const isDarkMode = appTheme.activeColorScheme === "dark";

    const textColor = isDarkMode ? "#7a7a7a" : "#9a9a9a";
    const borderColor = isDarkMode ? "#2f2f2f" : "#e1e1e1";
    const borderedStyle = { border: `1px solid ${borderColor}` };

    const colorNames = Object.keys(
      themeConfig?.lightColor ?? themeConfig?.darkColor ?? {},
    );
    const spectrumEntries = Object.entries(
      themeConfig?.lightSpectrum ?? themeConfig?.darkSpectrum ?? {},
    );

    const fgColors = colorNames
      .filter((colorName) => colorName.startsWith("fg"))
      .sort() as ThemeVars.Color[];
    const bgColors = colorNames
      .filter((colorName) => colorName.startsWith("bg"))
      .sort() as ThemeVars.Color[];
    const accentColors = colorNames
      .filter((colorName) => colorName.startsWith("accent"))
      .sort() as ThemeVars.Color[];

    return (
      <ThemeProvider
        theme={themeConfig}
        activeColorScheme={appTheme.activeColorScheme}
      >
        <VStack style={rootStyle} background="bgAlternate">
          {showComponents && (
            <HStack style={{ gap: 16 }}>
              <VStack
                style={{
                  gap: 16,
                  background: SHOW_DEBUG_BG_COLORS ? "red" : undefined,
                }}
                width={leftColumnWidth}
              >
                <Container style={{ marginLeft: -8, padding: 12 }}>
                  <LineChartBasicExample />
                </Container>

                <Container>
                  <ControlsExample />
                </Container>

                <HStack style={{ gap: 16 }}>
                  <Container width={280}>
                    <SegmentedTabsExample />
                  </Container>

                  <Container width={124}>
                    <Spinner size={2} />
                    <Spinner size={4} color="bgPrimary" />
                  </Container>
                </HStack>

                <HStack style={{ gap: 16 }}>
                  <Container width={160}>
                    <RollingNumberExample />
                  </Container>

                  <Container width={244}>
                    <HStack style={{ gap: 8 }}>
                      <SelectChipExample />
                      <InputChip
                        onClick={() => console.log("Remove ETH")}
                        value="ETH"
                        start={
                          <RemoteImage
                            source={assets.eth.imageUrl}
                            width={16}
                            height={16}
                          />
                        }
                      />
                    </HStack>
                  </Container>
                </HStack>

                <Container>
                  <PaginationExample />
                </Container>

                <Container>
                  <SelectExample />
                </Container>

                <Container>
                  <SearchExample />
                </Container>

                <Container>
                  <Accordion>
                    <AccordionItem
                      itemKey="1"
                      title="Accordion item"
                      subtitle="This is an example subtitle"
                      media={<Pictogram name="addToWatchlist" />}
                    >
                      <Text font="body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </Text>
                    </AccordionItem>
                    <AccordionItem
                      itemKey="2"
                      title="Accordion item"
                      subtitle="This is an example subtitle"
                      media={<Pictogram name="calendar" />}
                    >
                      <Text font="body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </Text>
                    </AccordionItem>
                  </Accordion>
                </Container>

                <Container>
                  <NudgeCard
                    title="Earn more crypto"
                    description="You’ve got unstaked crypto. Stake it now to earn more."
                    pictogram="key"
                    action="Start earning"
                    onActionPress={() => {}}
                    onDismissPress={() => {}}
                  />
                </Container>

                <Container>
                  <HStack style={{ gap: 24 }}>
                    {floatingAssetCards.map((card, index) => (
                      <FloatingAssetCard key={index} {...card} />
                    ))}
                  </HStack>
                </Container>
              </VStack>

              <VStack
                style={{
                  gap: 16,
                  background: SHOW_DEBUG_BG_COLORS ? "blue" : undefined,
                }}
                width={rightColumnWidth}
              >
                <Container>
                  <VStack style={{ gap: 16 }}>
                    <Tag intent="informational">primary</Tag>
                    <Tag intent="promotional">primary</Tag>
                  </VStack>
                  {tagColorSchemes.map((colorScheme) => (
                    <VStack key={colorScheme} style={{ gap: 16 }}>
                      <Tag intent="informational" colorScheme={colorScheme}>
                        {colorScheme}
                      </Tag>
                      <Tag intent="promotional" colorScheme={colorScheme}>
                        {colorScheme}
                      </Tag>
                    </VStack>
                  ))}
                </Container>

                <Container>
                  <Icon name="search" size="l" />
                  <Icon name="search" size="m" />
                  <Icon name="search" size="s" />
                  <Icon name="search" size="xs" />
                  <Icon name="add" size="l" />
                  <Icon name="add" size="m" />
                  <Icon name="add" size="s" />
                  <Icon name="add" size="xs" />
                  <Icon name="account" size="l" />
                  <Icon name="account" size="m" />
                  <Icon name="account" size="s" />
                  <Icon name="account" size="xs" />
                </Container>

                <HStack style={{ gap: 16 }}>
                  <Container width={240}>
                    <VStack style={{ gap: 8 }}>
                      {buttonVariants.map((variant) => (
                        <HStack
                          key={variant}
                          alignItems="center"
                          style={{ gap: 8 }}
                        >
                          <Button variant={variant} width={160}>
                            Button
                          </Button>
                          <IconButton
                            compact={false}
                            variant={variant}
                            name="add"
                          />
                        </HStack>
                      ))}
                        <HStack
                          alignItems="center"
                          style={{ gap: 8 }}
                        >
                          <Button loading width={160}>
                            Button
                          </Button>
                          <IconButton
                            compact={false}
                            loading
                            name="add"
                          />
                        </HStack>
                    </VStack>
                  </Container>

                  <VStack style={{ gap: 16 }}>
                    <Container width={344}>
                      <Avatar
                        name="Avatar"
                        colorScheme="red"
                        size="m"
                        shape="circle"
                      />
                      <Avatar
                        name="Avatar"
                        colorScheme="orange"
                        size="l"
                        shape="circle"
                      />
                      <Avatar
                        name="Avatar"
                        colorScheme="yellow"
                        size="xl"
                        shape="circle"
                      />
                      <Avatar
                        name="Avatar"
                        colorScheme="green"
                        size="m"
                        shape="square"
                      />
                      <Avatar
                        name="Avatar"
                        colorScheme="blue"
                        size="l"
                        shape="square"
                      />
                      <Avatar
                        name="Avatar"
                        colorScheme="purple"
                        size="xl"
                        shape="square"
                      />
                    </Container>

                    <Container width={344}>
                      <StepperVerticalCustomExample />
                    </Container>

                    <Container>
                      <TextInputExample />
                    </Container>
                  </VStack>
                </HStack>

                <HStack style={{ gap: 16 }}>
                  <Container width={240} alignSelf="stretch">
                    <VStack style={{ gap: 8 }}>
                      {buttonVariants.map((variant) => (
                        <HStack
                          key={variant}
                          alignItems="center"
                          style={{ gap: 8 }}
                        >
                          <Button compact variant={variant} width={160}>
                            Button
                          </Button>
                          <IconButton compact variant={variant} name="add" />
                        </HStack>
                      ))}
                       <HStack
                          alignItems="center"
                          style={{ gap: 8 }}
                        >
                          <Button compact loading width={160}>
                            Button
                          </Button>
                          <IconButton compact loading name="add" />
                        </HStack>
                    </VStack>
                  </Container>

                  <Container width={344}>
                    <DatePickerExample />
                  </Container>
                </HStack>

                <Container>
                  <StepperHorizontalBasicExample />
                </Container>

                <Container>
                  {bannerVariants.map((variant, index) => (
                    <Banner
                      key={variant}
                      title="Global banner"
                      label="Message last updated today at 3:24pm"
                      styleVariant="global"
                      startIcon="info"
                      startIconActive
                      variant={variant}
                      id={`banner-${index}`}
                      primaryAction={<Link href="#">Primary</Link>}
                      secondaryAction={<Link href="#">Secondary</Link>}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Banner>
                  ))}
                </Container>
              </VStack>
            </HStack>
          )}

          <VStack
            width={1040}
            style={{
              gap: 16,
              background: SHOW_DEBUG_BG_COLORS ? "orange" : undefined,
            }}
          >
            <Container width={1040} title="Spectrum">
              <VStack flexWrap="wrap" style={{ gap: 8 }}>
                <HStack>
                  <Box width={94} />
                  {spectrumHueSteps.map((spectrumHueStep) => (
                    <Box
                      key={spectrumHueStep}
                      width={45}
                      height={20}
                      justifyContent="center"
                    >
                      <BodyText>{spectrumHueStep}</BodyText>
                    </Box>
                  ))}
                </HStack>
                {spectrumHues.map((spectrumHue) => {
                  const hueColors = spectrumEntries.filter(([colorName]) =>
                    colorName.startsWith(spectrumHue),
                  );
                  return (
                    <HStack key={spectrumHue} alignItems="center">
                      <BodyText
                        width={94}
                        textAlign="end"
                        style={{ padding: 12 }}
                      >
                        {spectrumHue}
                      </BodyText>
                      {hueColors.map(([colorName, colorValue]) => (
                        <Box
                          key={colorName}
                          width={45}
                          height={45}
                          style={{
                            backgroundColor: `rgb(${colorValue})`,
                          }}
                        />
                      ))}
                    </HStack>
                  );
                })}
              </VStack>
            </Container>

            <Container title="Foreground Colors">
              <HStack flexWrap="wrap" style={{ gap: 8 }}>
                {fgColors.map((colorName) => (
                  <VStack key={colorName}>
                    <BodyText width={140} style={{ paddingBottom: 4 }}>
                      {colorName}
                    </BodyText>
                    <Box
                      width={45}
                      height={45}
                      background={colorName}
                      style={borderedStyle}
                    />
                  </VStack>
                ))}
              </HStack>
            </Container>

            <Container title="Background Colors">
              <HStack flexWrap="wrap" style={{ gap: 8 }}>
                {bgColors.map((colorName) => (
                  <VStack key={colorName}>
                    <BodyText width={140} style={{ paddingBottom: 4 }}>
                      {colorName}
                    </BodyText>
                    <Box
                      width={45}
                      height={45}
                      background={colorName}
                      style={borderedStyle}
                    />
                  </VStack>
                ))}
              </HStack>
            </Container>

            <Container title="Accent Colors">
              <HStack flexWrap="wrap" style={{ gap: 8 }}>
                {accentColors.map((colorName) => (
                  <VStack key={colorName}>
                    <BodyText width={140} style={{ paddingBottom: 4 }}>
                      {colorName}
                    </BodyText>
                    <Box
                      width={45}
                      height={45}
                      background={colorName}
                      style={borderedStyle}
                    />
                  </VStack>
                ))}
              </HStack>
            </Container>

            <HStack style={{ gap: 16 }}>
              <Container width={672} title="Space">
                <HStack style={{ gap: 8 }} alignItems="baseline">
                  {space.map((space) => (
                    <VStack key={space} alignItems="center">
                      <Box
                        key={space}
                        background="bgLineHeavy"
                        style={{
                          width: 12,
                          height: `var(--space-${space
                            .toString()
                            .replace(/\./g, "_")})`,
                        }}
                      />
                      <BodyText style={{ padding: 8 }}>{space}</BodyText>
                      <BodyText style={{ color: textColor }}>
                        {themeConfig.space[space]}
                      </BodyText>
                    </VStack>
                  ))}
                </HStack>
              </Container>

              <Container title="Icon Sizes" width={352}>
                <HStack style={{ gap: 24 }}>
                  {iconSizes.map((iconSize) => (
                    <VStack
                      key={iconSize}
                      alignItems="center"
                      alignSelf="baseline"
                    >
                      <HStack style={{ gap: 8 }}>
                        <Icon name="search" size={iconSize} />
                        <Icon active name="search" size={iconSize} />
                      </HStack>
                      <BodyText style={{ paddingTop: 8 }}>{iconSize}</BodyText>
                      <BodyText style={{ color: textColor }}>
                        {themeConfig.iconSize[iconSize]}
                      </BodyText>
                    </VStack>
                  ))}
                </HStack>
              </Container>
            </HStack>
          </VStack>

          <HStack style={{ gap: 16 }}>
            <VStack
              style={{
                gap: 16,
                background: SHOW_DEBUG_BG_COLORS ? "purple" : undefined,
              }}
              width={leftColumnWidth}
            >
              <Container title="Fonts">
                <VStack style={{ gap: 16 }}>
                  <Text font="display1">Display 1</Text>
                  <Text font="display2">Display 2</Text>
                  <Text font="display3">Display 3</Text>
                  <Text font="title1">Title 1</Text>
                  <Text font="title2">Title 2</Text>
                  <Text font="title3">Title 3</Text>
                  <Text font="title4">Title 4</Text>
                  <Text font="headline">Headline</Text>
                  <Text font="body">Body</Text>
                  <Text font="label1">Label 1</Text>
                  <Text font="label2">Label 2</Text>
                  <Text font="caption">Caption</Text>
                  <Text font="legal">Legal</Text>
                </VStack>
              </Container>

              <Container title="Text Colors">
                <VStack style={{ gap: 8 }}>
                  {fgColors.map((color) => (
                    <HStack
                      key={color}
                      alignItems="center"
                      style={{ gap: 8, padding: 8, borderRadius: 12 }}
                      background={
                        color === "fgInverse" ? "bgInverse" : undefined
                      }
                    >
                      <Icon color={color} name="search" size="s" />
                      <Text font="title4" color={color}>
                        Lorem ipsum dolor sit amet
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Container>
            </VStack>
            <VStack
              style={{
                gap: 16,
                background: SHOW_DEBUG_BG_COLORS ? "green" : undefined,
              }}
              width={rightColumnWidth}
            >
              <Container title="Avatar Sizes">
                <HStack style={{ gap: 24 }} alignItems="baseline">
                  {avatarSizes.map((avatarSize) => (
                    <VStack
                      key={avatarSize}
                      alignItems="center"
                      alignSelf="baseline"
                    >
                      <Avatar size={avatarSize} name="Avatar" />
                      <BodyText style={{ padding: 8 }}>{avatarSize}</BodyText>
                      <BodyText style={{ color: textColor }}>
                        {themeConfig.avatarSize[avatarSize]}
                      </BodyText>
                    </VStack>
                  ))}
                </HStack>
              </Container>

              <HStack style={{ gap: 16 }}>
                <Container width={324} title="Border Radius">
                  <VStack style={{ gap: 12, padding: 12 }}>
                    {borderRadii.map((borderRadius) => (
                      <HStack
                        key={borderRadius}
                        alignItems="center"
                        style={{ gap: 8 }}
                      >
                        <VStack>
                          <BodyText width={60} textAlign="end">
                            {borderRadius}
                          </BodyText>
                          <BodyText
                            textAlign="end"
                            style={{ color: textColor }}
                          >
                            {themeConfig.borderRadius[borderRadius]}
                          </BodyText>
                        </VStack>
                        <Box
                          width={60}
                          height={60}
                          borderRadius={borderRadius}
                          bordered
                          borderColor="bgLineHeavy"
                        />
                        <Box
                          width={120}
                          height={60}
                          borderRadius={borderRadius}
                          bordered
                          borderColor="bgLineHeavy"
                        />
                      </HStack>
                    ))}
                  </VStack>
                </Container>

                <VStack style={{ gap: 16 }}>
                  <Container title="Border Width" width={260}>
                    <VStack style={{ gap: 12, padding: 12 }}>
                      {borderWidths.map((borderWidth) => (
                        <HStack
                          key={borderWidth}
                          alignItems="center"
                          style={{ gap: 8 }}
                        >
                          <VStack>
                            <BodyText width={30} textAlign="end">
                              {borderWidth}
                            </BodyText>
                            <BodyText
                              textAlign="end"
                              style={{ color: textColor }}
                            >
                              {themeConfig.borderWidth[borderWidth]}
                            </BodyText>
                          </VStack>
                          <Box
                            width={120}
                            height={60}
                            borderWidth={borderWidth}
                            borderColor="bgLineHeavy"
                          />
                        </HStack>
                      ))}
                    </VStack>
                  </Container>

                  <Container title="Elevation" width={260}>
                    <VStack style={{ gap: 40, padding: 12 }}>
                      <Box
                        width={120}
                        height={120}
                        elevation={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <BodyText>Elevation 1</BodyText>
                      </Box>
                      <Box
                        width={120}
                        height={120}
                        elevation={2}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <BodyText>Elevation 2</BodyText>
                      </Box>
                    </VStack>
                  </Container>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </ThemeProvider>
    );
  },
);
