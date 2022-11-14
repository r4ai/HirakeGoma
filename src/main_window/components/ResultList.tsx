import { useTheme, css } from "@emotion/react";
import { FC } from "react";

interface ResultListProps {
  searchResults: SearchResults;
}

export const ResultList: FC<ResultListProps> = ({ searchResults }) => {
  const theme = useTheme();

  const resultListCss = {
    self: css`
      padding: 0px 7px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      row-gap: 5px;
    `,
    item: css`
      padding: 0px 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    `,
    itemTitle: css`
      color: ${theme.colors.textColor};
      font-size: 18px;
    `,
    itemDescription: css`
      color: ${theme.colors.descriptionTextColor};
      font-size: 10px;
    `
  };

  return (
    <>
      <div css={resultListCss.self}>
        {searchResults.map((item) => (
          <div key={item.name} css={resultListCss.item} onClick={() => {}}>
            <div css={resultListCss.itemTitle}>{item.name}</div>
            <div css={resultListCss.itemDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </>
  );
};
