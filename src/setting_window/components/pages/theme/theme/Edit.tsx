import {
  Text,
  Divider,
  Heading,
  Spacer,
  Stack,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  useToast,
  Box
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, useEffect, useState, useContext } from "react";
import {
  setting_theme_activate,
  setting_theme_create,
  setting_theme_get_all,
  setting_theme_change,
  setting_theme_save
} from "../../../../../commands/setting/theme";
import { Colors, Fonts, Themes } from "../../../../../types/Theme";
import { AlphaPicker, SettingHeading, SettingItem, SettingItemColorPicker } from "../../../parts/main";
import { FiRotateCcw } from "react-icons/fi";
import { Theme } from "@emotion/react";
import { createContext } from "vm";

interface resetButtonProps {
  themeCache: Theme;
  theme: Theme;
  setTheme: Function;
  colorPalletName?: keyof Colors;
  fontPalletName?: keyof Fonts;
  doesExistCache: boolean;
  setDoesExistCache: Function;
}

// TODO: 直前のキャッシュされたデータへリセットするボタンを実装する。
const ResetButton: FC<resetButtonProps> = ({
  themeCache,
  theme,
  setTheme,
  colorPalletName,
  fontPalletName,
  doesExistCache,
  setDoesExistCache
}) => {
  if (doesExistCache) {
    return (
      <IconButton
        onClick={() => {
          setDoesExistCache(false);
          let newTheme = { ...theme };
          if (colorPalletName !== undefined) {
            newTheme.colors[colorPalletName] = themeCache.colors[colorPalletName];
          } else if (fontPalletName !== undefined) {
            newTheme.fonts[fontPalletName] = themeCache.fonts[fontPalletName];
          }
          setTheme(newTheme);
        }}
        w={9}
        h={9}
        icon={<FiRotateCcw />}
        variant="transparent"
        aria-label="reset"
        colorScheme="blackAlpha"
      />
    );
  } else {
    return <></>;
  }
};

export const Edit: FC = () => {
  const fake_theme: Theme = {
    mode: "dark",
    activated: false,
    colors: {
      accentColor: "#e0e0e0",
      textColor: "#ededed",
      descriptionTextColor: "#c9c9c9",
      lineColor: "#00000000",
      backgroundColor: "#0f0f0f",
      backgroundTransparency: 0,
      inputBoxBackgroundColor: "#0d0d0d",
      inputBoxBackgroundTransparency: 0
    },
    fonts: {
      inputBoxFont: "",
      titleFont: "",
      descriptionFont: "",
      codeFont: ""
    }
  };

  const [selectedThemeName, setSelectedThemeName] = useState("fake");
  const [selectedTheme, setSelectedTheme] = useState<Theme>(fake_theme);
  const [selectedThemeCache, setSelectedThemeCache] = useState<Theme>(fake_theme);
  const [doesExistSelectedThemeCache, setDoesExistSelectedThemeCache] = useState(false);
  const [themeList, setThemeList] = useState<Themes>({});
  const toast = useToast();

  type Option = {
    label: string;
    value: string;
  } | null;
  type Options = Option[];

  useEffect(() => {
    // * SET SELECTED_THEME CORRESPONDING TO SELECTED_THEME_NAME
    if (selectedThemeName !== "fake") {
      setSelectedTheme(themeList[selectedThemeName]);
      setSelectedThemeCache(themeList[selectedThemeName]);
      setDoesExistSelectedThemeCache(true);
      console.log(selectedTheme);
    }
  }, [selectedThemeName]);

  useEffect(() => {
    // * SAVE THEME CHANGES IN BACKEND
    if (selectedThemeName !== "fake") {
      void setting_theme_change(selectedThemeName, selectedTheme);
      void setting_theme_save();
    }
  }, [selectedTheme]);

  useEffect(() => {
    // * GET THEME LIST FROM BACKEND
    void setting_theme_get_all().then(setThemeList);
  }, []);

  function convert(themes: Themes): Options {
    const res: Options = [];
    for (const item in themes) {
      res.push({ label: item, value: item });
    }
    return res;
  }

  async function handleSubmit(): Promise<void> {
    await setting_theme_create(selectedThemeName);
  }

  return (
    <>
      <SettingItem title="EDIT PRESET" description="Edit presets.">
        <Heading size="sm" as="h3">
          Preset
        </Heading>
        <Divider />
        <Select
          size="sm"
          placeholder="Select Preset to edit..."
          options={convert(themeList)}
          onChange={(e) => {
            if (e?.value === undefined) {
              void setting_theme_activate(e?.value).catch(() => {
                toast({
                  title: `Failed to change theme.`,
                  description: `Failed to select the theme ${e?.value}.`,
                  status: "error",
                  duration: 9000,
                  isClosable: true
                });
              });
            } else {
              setSelectedThemeName(e?.value);
            }
          }}
        ></Select>

        <Spacer />

        <Heading size="sm" as="h3">
          Colors
        </Heading>
        <Divider />
        <Stack direction={"row"} h={10}>
          <Text>Accent Color</Text>
          <Spacer />
          <SettingItemColorPicker pallet_name="accentColor" theme={selectedTheme} setTheme={setSelectedTheme} />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>Text Color</Text>
          <Spacer />
          <SettingItemColorPicker pallet_name="textColor" theme={selectedTheme} setTheme={setSelectedTheme} />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>Description Color</Text>
          <Spacer />
          <SettingItemColorPicker
            pallet_name="descriptionTextColor"
            theme={selectedTheme}
            setTheme={setSelectedTheme}
          />
        </Stack>
        <Stack direction={"row"} h={9}>
          <Text>Line Color</Text>
          <Spacer />
          <SettingItemColorPicker pallet_name="lineColor" theme={selectedTheme} setTheme={setSelectedTheme} />
        </Stack>
        <Stack direction={"row"} h={8}>
          <Text>Background Color</Text>
          <Spacer />
          <SettingItemColorPicker pallet_name="backgroundColor" theme={selectedTheme} setTheme={setSelectedTheme} />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>Background Transparency</Text>
          <Spacer />
          <AlphaPicker pallet_name="backgroundTransparency" theme={selectedTheme} setTheme={setSelectedTheme} />
        </Stack>
        <Stack direction={"row"} h={8}>
          <Text>InputBox Background Color</Text>
          <Spacer />
          <SettingItemColorPicker
            pallet_name="inputBoxBackgroundColor"
            theme={selectedTheme}
            setTheme={setSelectedTheme}
          />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>InputBox Background Transparency</Text>
          <Spacer />
          <AlphaPicker pallet_name="inputBoxBackgroundTransparency" theme={selectedTheme} setTheme={setSelectedTheme} />
        </Stack>

        <Spacer />

        <Heading size="sm" as="h3">
          Fonts
        </Heading>
        <Divider />
        <Stack direction={"row"} h={10}>
          <Text>Title Font</Text>
          <Spacer />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>Input Box Font</Text>
          <Spacer />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>Description Font</Text>
          <Spacer />
        </Stack>
        <Stack direction={"row"} h={10}>
          <Text>Code Font</Text>
          <Spacer />
        </Stack>
      </SettingItem>
    </>
  );
};
