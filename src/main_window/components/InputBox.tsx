import { css, useTheme } from "@emotion/react";
import { FC, Ref, useEffect } from "react";
import { rgba } from "emotion-rgba";
import { forwardRef } from "@chakra-ui/react";

type Props = JSX.IntrinsicElements["input"] & {
  keyword: string;
  setHideEnabled: Function;
  inputBoxRef: Ref<HTMLInputElement>;
};

export const InputBox: FC<Props> = ({ keyword, setHideEnabled, inputBoxRef, ...inputProps }) => {
  const theme = useTheme();

  const inputBoxCss = {
    self: css`
      grid-row: 1 / 2;
      grid-column: 1;
      height: 100%;
      padding: 5px 7px;
    `,
    input: css`
      width: 100%;
      padding: 10px 8px;
      font-size: 24px;
      border-radius: 8px;
      border: 2px solid ${theme.colors.lineColor};
      box-sizing: border-box;
      outline: 0;
      background: ${rgba(theme.colors.inputBoxBackgroundColor, theme.colors.inputBoxBackgroundTransparency)};
      color: ${theme.colors.textColor};
    `
  };

  return (
    <div
      css={inputBoxCss.self}
      onFocus={() => {
        setHideEnabled(true);
      }}
    >
      <input css={inputBoxCss.input} type="text" {...inputProps} autoFocus={true} ref={inputBoxRef} />
    </div>
  );
};
