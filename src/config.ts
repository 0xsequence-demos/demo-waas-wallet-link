import { KitConfig, getKitConnectWallets, getDefaultConnectors } from '@0xsequence/kit'
import { findNetworkConfig, allNetworks } from '@0xsequence/network'
import { Transport, zeroAddress } from 'viem'
import { createConfig, http } from 'wagmi'
import { Chain, arbitrumNova, arbitrumSepolia, mainnet, polygon } from 'wagmi/chains'

const projectAccessKey = 'pk_live_4e4b3b4b-1b4b-4b4b-8b4b-4b4b4b4b4b4b'

import { getDefaultChains } from '@0xsequence/kit'
 
const chains = [arbitrumNova, arbitrumSepolia, mainnet, polygon] as const satisfies Chain[] // optionally, supply an array of chain ID's getDefaultChains([1,137])
const transports = Object.fromEntries(chains.map(chain => [chain.id, http()]));

chains.forEach(chain => {
  const network = findNetworkConfig(allNetworks, chain.id)
  if (!network) return
  transports[chain.id] = http(network.rpcUrl)
})

const getUniversalConnectors = () => {
  const connectors = [
    ...getDefaultConnectors({
      walletConnectProjectId: 'c65a6cb1aa83c4e24500130f23a437d8',
      defaultChainId: arbitrumNova.id,
      appName: 'Link EOA Wallet',
      projectAccessKey
    }),
  ]
  return connectors
}

export const wagmiConfig = createConfig({
  // @ts-ignore
  transports,
  chains,
  connectors: getUniversalConnectors()
})

export const kitConfig: KitConfig = {
  projectAccessKey,
  defaultTheme: 'dark',
  signIn: {
    projectName: 'Link EOA Wallet'
  }
}
