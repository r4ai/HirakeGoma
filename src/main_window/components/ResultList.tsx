import { forwardRef, propNames, useStatStyles } from "@chakra-ui/react";
import { useTheme, css } from "@emotion/react";
import { invoke } from "@tauri-apps/api";
import { FC, useEffect, ComponentPropsWithoutRef, Ref, RefObject, useState, MutableRefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { convertFileSrc } from "@tauri-apps/api/tauri";

interface Props {
  searchResults: SearchResults;
  selectedItemIndex: number;
  setHideEnabled: Function;
  resultListRefs: MutableRefObject<RefObject<HTMLDivElement>[]>;
}

export const ResultList: FC<Props> = ({ searchResults, selectedItemIndex, setHideEnabled, resultListRefs }) => {
  const theme = useTheme();

  const resultListCss = {
    self: css`
      grid-row: 2 / 3;
      grid-column: 1;
      grid-auto-flow: row;
      grid-auto-rows: 50%;
      grid-template-columns: unset;
      grid-template-rows: unset;
      overflow-y: scroll;
      padding: 0px 7px;
    `,
    item: (i: number) => css`
      display: grid;
      grid-template-columns: 57px 1fr;
      grid-template-rows: auto auto;
      padding: 0px 6px;
      margin-bottom: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: ${i === selectedItemIndex ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0)"};
      cursor: pointer;
    `,
    itemIcon: css`
      grid-column: 1 / 2;
      grid-row: 1 / 3;
      height: 37px;
      align-self: center;
      justify-self: center;
      padding: 10px 010px 10px 0px;
      color: ${theme.colors.textColor};
      font-size: 6px;
    `,
    itemTitle: css`
      grid-column: 2 / 3;
      align-self: center;
      color: ${theme.colors.textColor};
      font-size: 18px;
    `,
    itemDescription: css`
      grid-column: 2 / 3;
      color: ${theme.colors.descriptionTextColor};
      font-size: 10px;
    `
  };

  function handleClick(command: string, args: CommandArgs): void {
    // TODO: HANDLE ERROR
    invoke(command, args);
    console.log(`CLICKED: ${command}`);
  }

  return (
    <>
      <div
        css={resultListCss.self}
        onFocus={() => {
          setHideEnabled(false);
        }}
      >
        {searchResults.map((item, i) => (
          <div
            key={item.name}
            css={resultListCss.item(i)}
            onClick={() => {
              handleClick(item.command, item.command_args);
            }}
            ref={resultListRefs.current[i]}
            tabIndex={i}
          >
            // TODO: convertFileSrcの処理をindex生成時に行うようにする（これめちゃ重いから）。
            <img css={resultListCss.itemIcon} src={convertFileSrc(item.icon_path)} alt="" />
            <div css={resultListCss.itemTitle}>{item.name}</div>
            <div css={resultListCss.itemDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </>
  );
};
