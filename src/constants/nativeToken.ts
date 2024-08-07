import {ChainId} from "@0xsequence/network";

export interface NativeTokenInfo {
  type: "NATIVE";
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
  logoURI: string;
}

const ETH: NativeTokenInfo = {
  type: "NATIVE",
  chainId: ChainId.MAINNET,
  symbol: "ETH",
  name: "Ethereum",
  decimals: 18,
  logoURI: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
};

const roETH: NativeTokenInfo = {
  ...ETH,
  chainId: ChainId.ROPSTEN,
  symbol: "roETH",
  name: "Ropsten Ethereum"
};

const rETH: NativeTokenInfo = {
  ...ETH,
  chainId: ChainId.RINKEBY,
  symbol: "rETH",
  name: "Rinkeby Ethereum"
};

const gETH: NativeTokenInfo = {
  ...ETH,
  chainId: ChainId.GOERLI,
  symbol: "gETH",
  name: "Goerli Ethereum"
};

const kETH: NativeTokenInfo = {
  ...ETH,
  chainId: ChainId.KOVAN,
  symbol: "kETH",
  name: "Kovan Ethereum"
};

const sETH: NativeTokenInfo = {
  ...ETH,
  chainId: ChainId.SEPOLIA,
  symbol: "sETH",
  name: "Sepolia Ethereum"
};

const MATIC: NativeTokenInfo = {
  chainId: ChainId.POLYGON,
  symbol: "MATIC",
  name: "Polygon",
  decimals: 18,
  type: "NATIVE",
  logoURI: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png"
};

const AVAX: NativeTokenInfo = {
  chainId: ChainId.AVALANCHE,
  symbol: "AVAX",
  name: "AVAX",
  decimals: 18,
  type: "NATIVE",
  logoURI:
    "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png"
};

const BNB: NativeTokenInfo = {
  chainId: ChainId.BSC,
  name: "BNB",
  type: "NATIVE",
  symbol: "BNB",
  decimals: 18,
  logoURI: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png"
};

const tBNB: NativeTokenInfo = {
  ...BNB,
  chainId: ChainId.BSC_TESTNET,
  symbol: "BNB",
  name: "Testnet BNB"
};

const HomeverseOAS: NativeTokenInfo = {
  chainId: ChainId.HOMEVERSE,
  symbol: "OAS",
  name: "OAS",
  type: "NATIVE",
  decimals: 18,
  logoURI:
    "https://media.githubusercontent.com/media/0xsequence/static-assets/master/data/output/images/tokens/medium/19011/0x0000000000000000000000000000000000000000.webp?token=AM4STHYPSN673ZWIQ4EIMVDGNASTE"
};

const tHomeVerseOAS: NativeTokenInfo = {
  ...HomeverseOAS,
  chainId: ChainId.HOMEVERSE_TESTNET,
  name: "Testnet OAS"
};

const aMatic: NativeTokenInfo = {
  ...MATIC,
  chainId: ChainId.POLYGON_AMOY,
  symbol: "aMATIC",
  name: "Amoy Polygon"
};

const XAI: NativeTokenInfo = {
  chainId: ChainId.XAI,
  symbol: "XAI",
  name: "XAI",
  type: "NATIVE",
  decimals: 18,
  logoURI: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
};

const tXAI: NativeTokenInfo = {
  ...XAI,
  chainId: ChainId.XAI_SEPOLIA,
  symbol: "sXAI",
  name: "Sepolia XAI"
};

const tXR: NativeTokenInfo = {
  chainId: ChainId.XR_SEPOLIA,
  symbol: "tXR",
  name: "Sepolia XR",
  type: "NATIVE",
  decimals: 18,
  logoURI: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png"
};

// List of native currencies for each networks
const nativeTokenInfo = {
  [ChainId.MAINNET]: ETH, // Mainnet
  [ChainId.ROPSTEN]: roETH, // Ropsten
  [ChainId.RINKEBY]: rETH, // Rinkeby
  [ChainId.GOERLI]: gETH, // Görli
  [ChainId.KOVAN]: kETH, // Kovan
  [ChainId.SEPOLIA]: sETH, // Sepolia
  [ChainId.POLYGON]: MATIC, // Matic
  [ChainId.POLYGON_AMOY]: aMatic, // Amoy
  [ChainId.POLYGON_ZKEVM]: {...ETH, chainId: ChainId.POLYGON_ZKEVM}, // Polygon zkEVM
  [ChainId.BSC]: BNB, // BSC
  [ChainId.BSC_TESTNET]: tBNB, // BNB Testnet
  [ChainId.AVALANCHE]: AVAX, // Avalanche
  [ChainId.AVALANCHE_TESTNET]: {...AVAX, chainId: ChainId.AVALANCHE_TESTNET}, // Avalanche Testnet
  [ChainId.ARBITRUM]: {...ETH, chainId: ChainId.ARBITRUM},
  [ChainId.ARBITRUM_NOVA]: {...ETH, chainId: ChainId.ARBITRUM_NOVA},
  [ChainId.ARBITRUM_SEPOLIA]: {...ETH, chainId: ChainId.ARBITRUM_SEPOLIA},
  [ChainId.OPTIMISM]: {...ETH, chainId: ChainId.OPTIMISM},
  [ChainId.OPTIMISM_SEPOLIA]: {...ETH, chainId: ChainId.OPTIMISM_SEPOLIA},
  [ChainId.BASE]: {...ETH, chainId: ChainId.BASE},
  [ChainId.BASE_SEPOLIA]: {...ETH, chainId: ChainId.BASE_SEPOLIA},
  [ChainId.XAI]: XAI,
  [ChainId.XAI_SEPOLIA]: tXAI,
  [ChainId.ASTAR_ZKEVM]: {...ETH, chainId: ChainId.ASTAR_ZKEVM},
  [ChainId.ASTAR_ZKYOTO]: {...ETH, chainId: ChainId.ASTAR_ZKYOTO},
  [ChainId.HOMEVERSE]: HomeverseOAS,
  [ChainId.HOMEVERSE_TESTNET]: tHomeVerseOAS,
  [ChainId.XR_SEPOLIA]: tXR
};

export const getNativeTokenInfo = (
  chainId: keyof typeof nativeTokenInfo
): NativeTokenInfo | null => {
  return nativeTokenInfo[chainId] || null;
};
