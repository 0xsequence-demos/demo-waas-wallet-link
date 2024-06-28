import {
  Box,
  Button,
  Card,
  Text,
  SignoutIcon,
  useMediaQuery,
  truncateAddress,
  SendIcon,
  CurrencyIcon
} from "@0xsequence/design-system";

import React, {useState} from "react";
import { messageToSign } from '../constants/messageToSign'
import {useAccount, useDisconnect, 
  useChainId,
  useConnections,
  usePublicClient,
  useWalletClient,
  } from "wagmi";
import {ClickToCopy} from "../components/ClickToCopy/ClickToCopy";
import {TransferTokenModal} from "./TransferTokenModal";
import {TransferCollectibleModal} from "./TransferCollectibleModal";

export const Connected = ({
  urlParams,
  setKey,
  eoaWalletAddress,
  chainId,
  isLoading,
  setIsLoading,
  isModalOpen,
  setIsModalOpen,
  isCollectibleModalOpen,
  setIsCollectibleModalOpen,

}: {
  urlParams: any;
  setKey: any;
  eoaWalletAddress: `0x${string}` | undefined;
  chainId: number;
  isLoading: boolean;
  setIsLoading: any;
  isModalOpen: boolean;
  setIsModalOpen: any;
  isCollectibleModalOpen: any;
  setIsCollectibleModalOpen: any;
}) => {
  const [isSigningMessage, setIsSigningMessage] = React.useState(false)
  const [isWalletLinked, setIsWalletLinked] = React.useState<boolean | undefined>()
  const [walletLinkingMessage, setWalletLinkingMessage] = React.useState<string | undefined>()
  const [linkedWallets, setLinkedWallets] = React.useState([])
  const {address} = useAccount()
  const {disconnect} = useDisconnect();
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId })

  const isMobile = useMediaQuery("@media screen and (max-width: 500px)");

  const getLinkedWallets = async () => {

    const apiUrl = 'https://api.sequence.app/rpc/API/GetLinkedWallets';
      
            const headers = {
                'Content-Type': 'application/json'
            };

            // TODO: SessionAuthProof for EW - add logic for EuthAuthProof
            // const proofString = `SessionAuthProof ${urlParams.get("sessionId")} ${urlParams.get("signature")} ${urlParams.get("nonce")}`

            console.log()

            const proofString = "test"

            const bodyData = {
                walletaddress: eoaWalletAddress
            };

            console.log(bodyData)
      
            fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(bodyData)
            })
            .then(response => response.json())
            .then(data => {
              console.log(data.linkedWallets)
              setLinkedWallets(data.linkedWallets)})
            .catch((error) => console.error('Error:', error));

  }

  const linkWallet = async () => {
    if (!walletClient || !publicClient) {
      return
    }

    setIsSigningMessage(true)

    try {

      const [account] = await walletClient.getAddresses()

      console.log(eoaWalletAddress)

      const message = `Link wallet to ${eoaWalletAddress}` // embedded wallet address 

      const sig = await walletClient.signMessage({
        account: address || ('' as `0x${string}`),
        message
      })
      console.log('address', address)
      console.log('signature:', sig)
      console.log('chainId in homepage', chainId)


      const isValid = await publicClient.verifyMessage({
        address: account,
        message,
        signature: sig
      })

      const apiUrl = 'https://api.sequence.app/rpc/API/LinkWallet';
      
            const headers = {
                'Content-Type': 'application/json'
            };

            // TODO: SessionAuthProof for EW - add logic for EuthAuthProof
            // const proofString = `SessionAuthProof ${urlParams.get("sessionId")} ${urlParams.get("signature")} ${urlParams.get("nonce")}`

            console.log()

            const proofString = "test"

            const bodyData = {
                chainId: chainId.toString(),
                walletAddress: eoaWalletAddress, // embedded wallet address
                ethAuthProofString: proofString,
                linkedWalletMessage: message, // Message from EOA
                linkedWalletSignature: sig
            };

            console.log(bodyData)
      
            fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(bodyData)
            })
            .then(response => response.json())
            .then(data => {
              console.log('linking');
              setIsWalletLinked(true)
              setWalletLinkingMessage("Wallet Linked")
              console.log(data)})
            .catch((error) => console.error('Error:', error)
            
            );


      // setIsSigningMessage(false)
      // setIsMessageValid(isValid)
      // setMessageSig(sig)

      console.log('isValid?', isValid)
    } catch (e) {
      setIsSigningMessage(false)
      console.error(e)
    }
  }



  return (
    <>
      <Card
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop="10"
        padding="6"
        paddingLeft="10"
        style={{maxWidth: "700px"}}
        width="full">
        <Box flexDirection="column" gap="4">
          <Box flexDirection={{sm: "column", md: "row"}} alignItems="center" gap="2">
            <Text color="text50" fontSize="medium" fontWeight="bold">
              Wallet Connected:
            </Text>
            {address && (
              <Box alignItems="center" gap="2">
                <Text color="text100" fontSize="medium" fontWeight="medium">
                  {isMobile ? truncateAddress(address) : address.slice(0,20) + "..." + address.slice(address.length - 10, address.length)}
                </Text>

                <ClickToCopy textToCopy={address} />
              </Box>
            )}
          </Box>
          <Box
            marginTop="2"
            gap="1"
            justifyContent="space-between"
            flexDirection={{sm: "column", md: "row"}}>
            <Box gap="1" flexDirection={{sm: "column", md: "row"}}>
            <Button
                shape="square"
                leftIcon={CurrencyIcon}
                label="Transfer Token"
                width={{sm: "full", md: "auto"}}
                onClick={() => setIsModalOpen(true)}
              />

              <Button
                shape="square"
                leftIcon={SendIcon}
                label="Transfer Collectible"
                width={{sm: "full", md: "auto"}}
                onClick={() => setIsCollectibleModalOpen(true)}
              />
              </Box>
          </Box>

      <Box
            marginTop="2"
            gap="1"
            justifyContent="space-between"
            flexDirection={{sm: "column", md: "row"}}>
              <Box gap="1" flexDirection={{sm: "column", md: "row"}}>



              <Button
                shape="square"
                leftIcon={CurrencyIcon}
                label="Link Wallet"
                width={{sm: "full", md: "auto"}}
                onClick={() => linkWallet()}
                isPending={isSigningMessage}
              />    

<Text variant="code" as="p" ellipsis>
                  {walletLinkingMessage}
                </Text>

<Button
                shape="square"
                leftIcon={CurrencyIcon}
                label="Get Linked Wallets"
                width={{sm: "full", md: "auto"}}
                onClick={() => getLinkedWallets()}
              />    
                    <ul>
        {linkedWallets.map(wallet => (
          <li>
            {wallet}
          </li>
        ))}
      </ul>
            </Box>

            <Button
              shape="square"
              variant="danger"
              rightIcon={SignoutIcon}
              label="Sign out"
              width={{sm: "full", md: "auto"}}
              onClick={() => disconnect()}
            />
          </Box>
        </Box>
      </Card>

      {isModalOpen && (
        <TransferTokenModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          chainId={chainId}
          eoaWalletAddress={eoaWalletAddress}
          embeddedWalletAddress={address}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCollectibleModalOpen && (
        <TransferCollectibleModal
          setKey={setKey}
          isCollectibleModalOpen={isCollectibleModalOpen}
          setIsCollectibleModalOpen={setIsCollectibleModalOpen}
          chainId={chainId}
          eoaWalletAddress={eoaWalletAddress}
          embeddedWalletAddress={address}
          onClose={() => setIsCollectibleModalOpen(false)}
        />
      )}
    </>
  );
};
