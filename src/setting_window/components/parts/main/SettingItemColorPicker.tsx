import { Input } from "@chakra-ui/react";
import { Theme } from "@emotion/react";
import { FC } from "react";
import { Colors } from "../../../../types/Theme";

interface Props {
  pallet_name: keyof Colors;
  theme: Theme;
  setTheme: Function;
}

export const SettingItemColorPicker: FC<Props> = ({ pallet_name, theme, setTheme }) => {
  return (
    <>
      <Input
        type="color"
        value={theme.colors[pallet_name]}
        appearance="none"
        width={9}
        height={9}
        border="none"
        padding="0"
        backgroundColor="transparent"
        cursor="pointer"
        onChange={(e) => {
          let newTheme: Theme = { ...theme };
          newTheme.colors[pallet_name] = e.target.value;
          setTheme(newTheme);
        }}
        css={{
          "&::-webkit-color-swatch": {
            borderRadius: "5px",
            border: "none"
          },
          "&::-moz-color-swatch": {
            borderRadius: "5px",
            border: "none"
          }
        }}
      />
    </>
  );
};
