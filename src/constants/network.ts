import {ChainId, NetworkConfig, networks} from "@0xsequence/network";

export const enabledChainIDs = [
  ChainId.MAINNET,
  ChainId.SEPOLIA,
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.ARBITRUM_SEPOLIA,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.POLYGON_AMOY,
  ChainId.BASE,
  ChainId.BASE_SEPOLIA,
  ChainId.OPTIMISM,
  ChainId.OPTIMISM_SEPOLIA,
  ChainId.AVALANCHE,
  ChainId.AVALANCHE_TESTNET,
  ChainId.HOMEVERSE,
  ChainId.HOMEVERSE_TESTNET,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ASTAR_ZKEVM,
  ChainId.ASTAR_ZKYOTO,
  ChainId.XAI,
  ChainId.XAI_SEPOLIA,
  ChainId.XR_SEPOLIA
];

export const enabledChainIDMappings: any = {
  1: 'mainnet',
  11155111:'sepolia',
  42161: 'arbitrum',
  42170: 'arbitrum-nova',
  421614: 'arbitrum-sepolia',
  137: 'polygon',
  1101: 'polygon-zkevm',
  80002: 'amoy',
  8453: 'base',
  84532: 'base-sepolia',
  10: 'optimism',
  11155420: 'optimism-sepolia',
  43114: 'avalanche',
  43113: 'avalanche-testnet',
  19011: 'homeverse',
  40875: 'homeverse-testnet',
  56: 'bsc',
  97: 'bsc-tesnet',
  3776: 'astar-zkevm',
  6038361: 'astar-zkyoto',
  660279: 'xai',
  37714555529: 'xai-sepolia',
  3770: 'xr-sepolia'
}

export const explorerNetworks = Object.fromEntries(
  Object.entries(networks).filter(([chainID]) =>
    enabledChainIDs.includes(parseInt(chainID))
  )
) as Record<ChainId, NetworkConfig>;

const networksSortedList = (includeMainnets = true, includeTestnets = true) =>
  Object.values(
    Object.entries(explorerNetworks).filter(([_, config]) => {
      if (includeMainnets && includeTestnets) return true;
      if (includeMainnets && !config.testnet) return true;
      if (includeTestnets && config.testnet) return true;
    })
  )
    .sort(([_, a], [__, b]) => {
      const aa = enabledChainIDs.indexOf(a.chainId);
      const bb = enabledChainIDs.indexOf(b.chainId);
      return aa - bb;
    })
    .map(([_, config]) => config);

export const networksFullList = networksSortedList(true, true);
