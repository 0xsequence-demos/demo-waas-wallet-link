import React from "react";
import {TokenBalance} from "@0xsequence/indexer";
import {ethers} from "ethers";
import {SelectButton} from "../SelectButton/SelectButton";
import {Box, Text} from "@0xsequence/design-system";
import {TokenWithChainImage} from "../TokenWithChainImage/TokenWithChainImage";

interface TokenSelectButtonProps {
  token: TokenBalance;
  handleSelectCoin: (tokenAddress: string) => void;
  selected: boolean;
  disabled?: boolean;
}

export const TokenSelectButton = (props: TokenSelectButtonProps) => {
  const {token, disabled, selected, handleSelectCoin} = props;

  const formattedBalance = ethers.utils.formatUnits(
    token.balance,
    token.contractInfo?.decimals
  );

  return (
    <SelectButton
      value={token.contractAddress}
      selected={selected}
      disabled={disabled}
      onClick={handleSelectCoin}>
      <Box alignItems="center" gap="3">
        <TokenWithChainImage
          src={token.contractInfo?.logoURI}
          symbol={token.contractInfo?.symbol || ""}
          chainId={token.chainId}
        />
        <Box flexDirection="column" minWidth="0">
          <Box gap="1" alignItems="center">
            <Text variant="normal" fontWeight="bold" color="text100" ellipsis>
              {token.contractInfo?.name}
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
