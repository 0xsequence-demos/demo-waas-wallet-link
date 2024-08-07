import {Box, CheckmarkIcon} from "@0xsequence/design-system";
import React from "react";

interface SelectedIndicatorProps {
  selected: boolean;
  className?: string;
}

export const SelectedIndicator = (props: SelectedIndicatorProps) => {
  const {selected, className} = props;
  return (
    <Box
      borderStyle="solid"
      borderColor="borderNormal"
      borderWidth="thick"
      borderRadius="circle"
      marginLeft="4"
      position="relative"
      flexShrink="0"
      width="8"
      height="8"
      className={className}>
      <Box
        background="backgroundInverse"
        position="absolute"
        alignItems="center"
        justifyContent="center"
        borderRadius="circle"
        color="textInverse100"
        width="8"
        height="8"
        opacity={selected ? "100" : "0"}
        style={{
          top: "-2px",
          left: "-2px"
        }}>
        <CheckmarkIcon />
      </Box>
    </Box>
  );
};
