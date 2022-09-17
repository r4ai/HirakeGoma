import { css, useTheme } from "@emotion/react";
import { FC } from "react";

interface InputBoxProps {
  text: string;
}

export const InputBox: FC<InputBoxProps> = ({ text }) => {
  const theme = useTheme();

  const inputBoxCss = {
    self: css`
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
      background-color: ${theme.colors.inputBoxBackgroundColor};
      color: ${theme.colors.textColor};
    `
  };

  return (
    <div css={inputBoxCss.self}>
      <input css={inputBoxCss.input} type="text" value={text} />
    </div>
  );
};
