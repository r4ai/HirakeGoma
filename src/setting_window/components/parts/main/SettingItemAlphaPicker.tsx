import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip } from "@chakra-ui/react";
import { Theme } from "@emotion/react";
import { Colors } from "../../../../types/Theme";
import { FC, useEffect, useState } from "react";

interface Props {
  pallet_name: keyof Colors;
  theme: Theme;
  setTheme: Function;
}

export const AlphaPicker: FC<Props> = ({ pallet_name, theme, setTheme }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Slider
      min={0}
      max={1}
      step={0.01}
      w={40}
      colorScheme="facebook"
      onChange={(value) => {
        let newTheme: Theme = { ...theme };
        if (typeof newTheme.colors[pallet_name] === "number") {
          newTheme.colors[pallet_name] = value;
          setTheme(newTheme);
        }
      }}
      value={theme.colors[pallet_name]}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="facebook.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`${Math.round(theme.colors[pallet_name] * 100)}%`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
};
