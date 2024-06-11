import {Box, Button, Spinner, Text, TextInput} from "@0xsequence/design-system";
import {GetEtherBalanceArgs, SequenceIndexer, TokenBalance} from "@0xsequence/indexer";
import React, {useEffect, useState} from "react";
import {ContentModal} from "../components/ContentModal/ContentModal";
import {allNetworks} from "@0xsequence/network";
import {ethers} from "ethers";
import {useSendTransaction, useWriteContract} from "wagmi";
import {parseEther} from "viem";
import {getNativeTokenInfo} from "../constants/nativeToken";
import {ERC20_ABI} from "../constants/abi";
import {NativeTokenSelectButton} from "../components/NativeTokenSelectButton/NativeTokenSelectButton";
import {TokenSelectButton} from "../components/TokenSelectButton/TokenSelectButton";

const PROJECT_ACCESS_KEY = import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY;
export const TransferTokenModal = ({
  chainId,
  eoaWalletAddress,
  embeddedWalletAddress,
  onClose
}: {
  chainId: number;
  eoaWalletAddress: `0x${string}` | undefined;
  embeddedWalletAddress: `0x${string}` | undefined;
  onClose: () => void;
}) => {
  const [nativeTokenBalance, setNativeTokenBalance] = useState<ethers.BigNumber>();
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [isNativeTokenSelected, setIsNativeTokenSelected] = useState(true);
  const network = allNetworks.find((n) => n.chainId === chainId);
  const [amount, setAmount] = useState("");
  const client = new SequenceIndexer(
    "https://" + network?.name + "-indexer.sequence.app",
    PROJECT_ACCESS_KEY
  );
  const {sendTransaction, isPending: isNativeTransferPending} = useSendTransaction();
  const {writeContract, isPending: isWriteContractPending} = useWriteContract();
  const isPending = isNativeTransferPending || isWriteContractPending;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eoaWalletAddress) {
      fetchTokenBalances();
    }
  }, [embeddedWalletAddress]);

  const fetchTokenBalances = async () => {
    if (!network || !eoaWalletAddress) {
      return;
    }

    try {
      setIsLoading(true);
      const nativeTokenBalance = await client.getEtherBalance({
        accountAddress: embeddedWalletAddress
      } as GetEtherBalanceArgs);
      const tokenBalances = await client.getTokenBalances({
        accountAddress: embeddedWalletAddress,
        includeMetadata: true
      } as GetEtherBalanceArgs);

      setNativeTokenBalance(ethers.BigNumber.from(nativeTokenBalance.balance.balanceWei));

      if (tokenBalances && tokenBalances.balances && tokenBalances.balances.length > 0) {
        const filteredBalances = tokenBalances.balances.filter(
          (balance) => balance.contractType === "ERC20"
        );
        setTokenBalances(filteredBalances);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransactionHandler = async () => {
    const to = eoaWalletAddress as `0x${string}`;
    const value = amount;

    if (to && isNativeTokenSelected) {
      sendTransaction({to, value: parseEther(value), gas: null});
    }

    if (selectedToken) {
      const tokenAddress = selectedToken.contractAddress;

      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [
          to,
          `${Number(value) * Math.pow(10, selectedToken.contractInfo?.decimals || 18)}`
        ]
      });
    }
  };

  return (
    <ContentModal onClose={onClose}>
      <Box display="flex" flexDirection="column" gap="10" overflowY="scroll" padding="6">
        <Box flexDirection="column" gap="3">
          <Text as="h1" variant="normal" fontWeight="medium" color="text100">
            Transfer Token
          </Text>

          {isLoading ? (
            <Box alignItems="center" justifyContent="center">
              <Spinner />
            </Box>
          ) : (
            <>
              {tokenBalances && tokenBalances.length > 0 && (
                <>
                  <Box
                    overflow="auto"
                    style={{
                      maxHeight: "200px"
                    }}>
                    <Box flexDirection="column" gap="2">
                      <NativeTokenSelectButton
                        token={getNativeTokenInfo(chainId)!}
                        selected={isNativeTokenSelected}
                        handleSelectCoin={() => {
                          setIsNativeTokenSelected(true);
                          setSelectedToken(null);
                        }}
                        nativeTokenBalance={nativeTokenBalance!}
                        chainId={chainId}
                      />
                      {tokenBalances.map((token) => (
                        <TokenSelectButton
                          token={token}
                          selected={selectedToken === token}
                          handleSelectCoin={() => {
                            setIsNativeTokenSelected(false);
                            setSelectedToken(token);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <TextInput
                    readOnly
                    value={embeddedWalletAddress}
                    label="From"
                    labelLocation="left"
                  />

                  <TextInput
                    readOnly
                    value={eoaWalletAddress}
                    label="To"
                    labelLocation="left"
                  />

                  <TextInput
                    type="number"
                    value={amount}
                    label="Amount"
                    labelLocation="left"
                    onChange={(e: any) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />

                  <Button
                    marginLeft="auto"
                    onClick={sendTransactionHandler}
                    variant="primary"
                    shape="square"
                    leftIcon={isPending ? () => <Spinner /> : undefined}
                    label="Send Transaction"
                    disabled={isPending || amount === ""}
                  />
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </ContentModal>
  );
};
