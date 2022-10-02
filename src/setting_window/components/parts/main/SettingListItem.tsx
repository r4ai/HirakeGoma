import { Box, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { FC } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";

interface Props {
  placeholder?: string;
  value: string;
  editIcon?: JSX.Element;
  removeIcon?: JSX.Element;
  onEditIconClick?: Function;
  onRemoveIconClick?: Function;
}

export const SettingListItem: FC<Props> = ({
  placeholder = "...",
  value,
  editIcon = <FiEdit />,
  removeIcon = <FiTrash2 />,
  onEditIconClick = () => {},
  onRemoveIconClick = () => {}
}) => {
  return (
    <>
      <Box w="100%">
        <InputGroup>
          <Input placeholder={placeholder} value={value} />
          <IconButton
            aria-label="edit this folder path"
            icon={editIcon}
            variant="outline"
            colorScheme="blue"
            mx={1}
            onClick={() => onEditIconClick()}
          />
          <IconButton
            aria-label="remove this folder path"
            icon={removeIcon}
            variant="outline"
            colorScheme="red"
            onClick={() => onRemoveIconClick()}
          />
        </InputGroup>
      </Box>
    </>
  );
};
