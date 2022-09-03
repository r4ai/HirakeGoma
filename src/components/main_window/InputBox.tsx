import { FC } from "react";
import { css } from "@emotion/react";

interface InputBoxProps {
  text: string;
}

const body = css`
  width: 100%;
  margin: 1px;
`;

const input = css`
  width: 100%;
`;

const searchButton = css``;

export const InputBox: FC<InputBoxProps> = ({ text }) => {
  return (
    <div css={body}>
      <input type="text" value={text} />
    </div>
  );
};
