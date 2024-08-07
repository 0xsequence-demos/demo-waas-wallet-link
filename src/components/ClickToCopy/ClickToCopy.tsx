import React, {PropsWithChildren} from "react";

import {Box, CheckmarkIcon, CopyIcon} from "@0xsequence/design-system";
import {useClipboard} from "../../hooks/useClipboard";

export const ClickToCopy = ({
  children,
  textToCopy
}: PropsWithChildren<{
  textToCopy: string;
}>) => {
  const {copy, isCopied} = useClipboard();

  return (
    <Box alignItems={"center"} display={"flex"} flexDirection={"row"} gap={"1"}>
      {children}

      <Box display="flex" onClick={() => copy(textToCopy)}>
        {isCopied ? (
          <CheckmarkIcon color="positive" />
        ) : (
          <Box cursor="pointer" display="flex">
            <CopyIcon color="text50" />
          </Box>
        )}
      </Box>
    </Box>
  );
};
