import React from "react";
import {ethers} from "ethers";
import {NativeTokenInfo} from "../../constants/nativeToken";
import {SelectButton} from "../SelectButton/SelectButton";
import {Box, Text, TokenImage} from "@0xsequence/design-system";

interface NativeTokenSelectButtonProps {
  token: NativeTokenInfo;
  handleSelectCoin: (tokenAddress: string) => void;
  chainId: number;
  nativeTokenBalance: ethers.BigNumber;
  selected: boolean;
  disabled?: boolean;
}

export const NativeTokenSelectButton = (props: NativeTokenSelectButtonProps) => {
  const {token, disabled, selected, handleSelectCoin, nativeTokenBalance, chainId} =
    props;

  const formattedBalance = ethers.utils.formatEther(nativeTokenBalance || 0);

  return (
    <SelectButton
      value={token.name}
      selected={selected}
      disabled={disabled}
      onClick={handleSelectCoin}>
      <Box alignItems="center" gap="3">
        <TokenImage size="lg" src={token.logoURI} symbol={token.symbol} />
        <Box flexDirection="column" minWidth="0">
          <Box gap="1" alignItems="center">
            <Text variant="normal" fontWeight="bold" color="text100" ellipsis>
              {token.name}
            </Text>
          </Box>

          <Text variant="normal" fontWeight="medium" color="text50" uppercase>
            {formattedBalance}
          </Text>
        </Box>
      </Box>
    </SelectButton>
  );
};
