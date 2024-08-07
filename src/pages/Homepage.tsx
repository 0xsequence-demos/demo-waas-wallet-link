import React from "react";

import {
  Box,
  Button,
  Card,
  Text,
  Image,
  Spinner,
  truncateAddress,
  useMediaQuery,
  TabbedNav,
  Tabs
} from "@0xsequence/design-system";
import {useOpenConnectModal} from "@0xsequence/kit";
import {useAccount, useSwitchChain, useDisconnect} from "wagmi";
import {useEffect, useState} from "react";
import '../styles/Homepage.css'
import {Connected} from "./Connected";
import {ClickToCopy} from "../components/ClickToCopy/ClickToCopy";
import {SequenceIndexer} from '@0xsequence/indexer'
import sequenceIconSrc from "../asset/sequence-icon.svg";
import {enabledChainIDMappings}from '../constants/network'

export const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollectibleModalOpen, setIsCollectibleModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [verifiedWaaSAddress, setVerifiedWaaSAddress] = useState<string>();
  const [inProgress, setInProgress] = useState<boolean>(false);
  const urlParams = new URLSearchParams(location.search);
  const chainId: string | null = urlParams.get("chainId");

  const [key, setKey] = useState(0);

  const verifyEmbeddedWallet = async () => {
    setInProgress(true);

    const nonce: string | null = urlParams.get("nonce");
    const signature: string | null = urlParams.get("signature");

    const sessionId: string | null = urlParams.get("sessionId");

    console.log("nonce", nonce);
    console.log("signature", signature);
    console.log("chainId", chainId);
    console.log("sessionId", sessionId);

    if (!nonce || !signature || !chainId || !sessionId) {
      console.log("Missing parameters for embedded wallet verification");
      return;
    }


    const apiUrl = 'https://dev-api.sequence.app/rpc/API/ValidateWaaSVerificationNonce';
      
      const headers = {
          'Content-Type': 'application/json'
      };

      const bodyData = {nonce, signature, chainId, sessionId}

      console.log(bodyData)

      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(bodyData)
      })

    const data = await response.json();

    if (data.walletAddress) {
      console.log("Wallet is verified");
      setVerifiedWaaSAddress(data.walletAddress);
    } else {
      console.log("Wallet is not verified");
    }
    setInProgress(false);
  };

  useEffect(() => {
    verifyEmbeddedWallet();
  }, []);

  return (
    <main>
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="5"
        height="vh">
        <Image
          src={sequenceIconSrc}
          alt="Sequence Logo"
          style={{
            width: "150px"
          }}
        />

        {!inProgress && verifiedWaaSAddress != null ? (
          <>
          <div className="container">
            <div className="left-side">
              <EmbeddedWalletState
                setKey={setKey}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                walletAddress={verifiedWaaSAddress}
                chainId={Number(chainId || 1)}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isCollectibleModalOpen={isCollectibleModalOpen}
                setIsCollectibleModalOpen={setIsCollectibleModalOpen}
              />
            </div>
            <div className="right-side">
              <Inventory key={key} embeddedWallet={verifiedWaaSAddress}/>
            </div>
          </div>
          </>
        ) : (
          <Box gap="2" marginY="4" alignItems="center" justifyContent="center">
            <Spinner />
          </Box>
        )}
      </Box>

      <Button label="example" onClick={()=>{
      fetch('/example').then((r)=>{
        debugger
      })
    }} />
    <Button label="test" onClick={()=>{
      fetch('/test').then((r)=>{
        debugger
      })
    }} />
    <Button label="nothing" onClick={()=>{
      fetch('/nothing').then((r)=>{
        debugger
      })
    }} />
    <Button label="example2" onClick={()=>{
      fetch('/example2').then((r)=>{
        debugger
      })
    }} />
    <Button label="generateNonce" onClick={()=>{
      fetch('/generateNonce').then((r)=>{
        debugger
      })
    }} />
    <Button label="generateNonce2" onClick={()=>{
      fetch('/generateNonce2').then((r)=>{
        debugger
      })
    }} />
    <Button label="generateNonce3" onClick={()=>{
      fetch('/generateNonce3').then((r)=>{
        debugger
      })
    }} />
    <Button label="verifyNonce" onClick={()=>{
      fetch('/verifyNonce').then((r)=>{
        debugger
      })
    }} />
    </main>
  );
};

const Inventory = (props: any) => {

  const {isConnected, address} = useAccount();
  const [embeddedWalletGallery, setEmbeddedWalletGallery] = useState([
  ])

  const [eoaWalletGallery, setEoaWalletGallery] = useState([

  ])

  useEffect(()=> {
    queryBalances()
  }, [props.key])

  const query = async (addresses: string[]) => {
    const urlParams = new URLSearchParams(location.search);
    const chainId: string = urlParams.get("chainId")!;

    const networkName: any = enabledChainIDMappings[chainId]
    const indexer = new SequenceIndexer(`https://${networkName}-indexer.sequence.app`, 'AQAAAAAAAF_JvPALhBthL7VGn6jV0YDqaFY');
    const balancePromises: any = addresses.map(accountAddress => 
        indexer.getTokenBalances({
            accountAddress: accountAddress,
            includeMetadata: true
        })
    );
    const results:any = await Promise.all(balancePromises);
    
    // Aggregate the balances
    const aggregatedBalances = results.reduce((acc: any, result: any) => {
        result.balances.forEach((balance: any) => {
            const existingBalance = acc.find((b: any) => b.contractAddress === balance.contractAddress);
            if (existingBalance) {
                existingBalance.balance = (Number(existingBalance.balance) + Number(balance.balance)).toString();
            } else {
                // Convert balance to string as the balance is being stored in that format
                balance.balance = balance.balance.toString();
                acc.push(balance);
            }
        });
        return acc;
    }, []);
    return aggregatedBalances;
  };

  const queryBalances = async () => {
    if(address){
      const tokenBalances = await query([address])
      const images: any = []
      console.log(tokenBalances)
      await Promise.all(tokenBalances.map(async (token: any) => {
        if(token.tokenMetadata?.image){
          const response = await fetch(token.tokenMetadata.image)
          if (response.ok) {
            images.push(token.tokenMetadata.image)
          }
        }
      }))
      setEoaWalletGallery(images)
    } else {
      setEoaWalletGallery([])
    }

    const tokenBalancesEmbeddedWallet = await query([props.embeddedWallet])
    const imagesEmbeddedWallet: any = []
    
    await Promise.all(tokenBalancesEmbeddedWallet.map(async (token: any) => {
      if(token.tokenMetadata?.image){
        const response = await fetch(token.tokenMetadata.image)
        if (response.ok) {
          imagesEmbeddedWallet.push(token.tokenMetadata.image)
        }
      }
    }))
    setEmbeddedWalletGallery(imagesEmbeddedWallet)
  }

  useEffect(() => {

  }, [eoaWalletGallery, embeddedWalletGallery])

  useEffect(() => {
    setTimeout(async () => {
      if(address){
        queryBalances()
        const urlParams = new URLSearchParams(location.search);
        const chainId: string = urlParams.get("chainId")!;
        const networkName: any = enabledChainIDMappings[chainId]
        const indexer = new SequenceIndexer(`https://${networkName}-indexer.sequence.app`, 'c3bgcU3LkFR9Bp9jFssLenPAAAAAAAAAA')
    
        const req: any = {
            filter: {
              accounts: [address],
            },
        }
    
        const options = {
          onMessage: (msg: any) => {
            console.log('msg', msg)
            queryBalances()

          },
          onError: (err: any) => {
            console.error('err', err)
          }
        }

        setTimeout(async () => {
          await indexer.subscribeEvents(req, options)
        }, 0)
      }
    }, 0)
  }, [address, props.isLoading])

  useEffect(() => {

  }, [eoaWalletGallery, ])

  return (
  <>
  <div style={{textAlign: 'center'}}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: '800'}}>Inventory</Text>
        </div>
        <br/>
      <Card>
      <Tabs key={props.key} onClick={() => queryBalances()} defaultValue="embedded-wallet" tabs={
        [
          {
            value: 'embedded-wallet',
            label: 'Embedded Wallet',
            content: <div className="gallery">
              {embeddedWalletGallery.map((image: any, index: any) => (
                <div className="image-container" key={index}>
                  <img src={image} alt={`img-${index}`} className="image" />
                </div>
              ))}
              </div>
          },
          {
            value: 'eoa',
            label: 'EOA',
            content: <div className="gallery">
            {eoaWalletGallery.map((image: any, index: any) => (
              <div className="image-container" key={index}>
                <img src={image} alt={`img-${index}`} className="image" />
              </div>
            ))}
            </div>
          },
          {
            value: 'all',
            label: 'All',
            content: <div className="gallery">{[...eoaWalletGallery, ...embeddedWalletGallery].map((image: any, index: any) => (
              <div className="image-container" key={index}>
                <img src={image} alt={`img-${index}`} className="image" />
              </div>
            ))}</div>
          },
        ]
      }>

      </Tabs>
      </Card>
  </>
  )
}

const EmbeddedWalletState = (props: {
  setKey: any,
  walletAddress: string | undefined;
  chainId: number;
  isLoading: boolean;
  setIsLoading: any;
  setIsModalOpen: any;
  isModalOpen: boolean;
  isCollectibleModalOpen: boolean;
  setIsCollectibleModalOpen: any;
}) => {
  const {walletAddress} = props;
  const {disconnect} = useDisconnect()
  const {isConnected } = useAccount();
  const {setOpenConnectModal} = useOpenConnectModal();
  const isMobile = useMediaQuery("@media screen and (max-width: 500px)");
  const {switchChain} = useSwitchChain();

  const onClickConnect = () => {
    setOpenConnectModal(true)
  };

  useEffect(() => {
    if (props.chainId) {
      switchChain({chainId: props.chainId});
    }
  }, [props.chainId]);

  return (
    <Box padding="4" style={{ 
      marginTop: '-110px',
      }}>
      <div style={{textAlign: 'center'}}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: '800'}}>Wallets</Text>
      </div>
      <br/>
      <Card
        padding="6"
        gap="2"
        alignItems="center"
        flexDirection={{sm: "column", md: "row"}}
        style={{maxWidth: "700px"}}
        width="full">
        <Text color="text50" fontSize="medium" fontWeight="bold">
          Embedded Wallet Verified:
        </Text>
        {walletAddress && (
          <Box alignItems="center" gap="1">
            <Text color="text100" fontSize="medium" fontWeight="medium">
              {isMobile ? truncateAddress(walletAddress) : walletAddress.slice(0,20) + "..." + walletAddress.slice(walletAddress.length - 10, walletAddress.length)}
            </Text>

            <ClickToCopy textToCopy={walletAddress} />
          </Box>
        )}
      </Card>
 
      {!isConnected ? (
        <Box marginX="auto" gap="2" justifyContent="center" marginTop="10">
          <Button
            onClick={onClickConnect}
            variant="feature"
            label="Connect your EOA Wallet"
          />
        </Box>
    ) :
      walletAddress &&
        <Connected
          setKey={props.setKey}
          isModalOpen={props.isModalOpen}
          setIsModalOpen={props.setIsModalOpen}
          isCollectibleModalOpen={props.isCollectibleModalOpen}
          setIsCollectibleModalOpen={props.setIsCollectibleModalOpen}
          isLoading={props.isLoading}
          setIsLoading={props.setIsLoading}
          chainId={props.chainId}
          eoaWalletAddress={walletAddress as `0x${string}` | undefined}
        />
      
    }
    </Box>
  );
};
