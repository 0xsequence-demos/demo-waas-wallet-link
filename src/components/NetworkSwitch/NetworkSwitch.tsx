import {
  Box,
  Text,
  Select,
  TokenImage,
  Spinner,
  NetworkImage
} from "@0xsequence/design-system";
import React, {useState} from "react";
import {ChainId, NetworkConfig} from "@0xsequence/network";
import {networksFullList} from "../../constants/network";

export function NetworkSwitch({
  defaultChainId,
  onNetworkChange
}: {
  defaultChainId: ChainId;
  onNetworkChange: (network: NetworkConfig) => void;
}) {
  const defaultNetwork = networksFullList.find(
    (chain) => chain.chainId === defaultChainId
  );
  const [network, setNetwork] = useState<undefined | NetworkConfig>(
    defaultNetwork || undefined
  );
  const networkList = networksFullList;

  return (
    <Box marginBottom="4">
      <Box marginBottom="4">
        <Text variant="normal" color="text100" fontWeight="bold">
          Network
        </Text>
      </Box>
      <Box>
        <Select
          name="chainId"
          labelLocation="top"
          onValueChange={(val) => {
            const selected = networkList?.find((chain) => chain.name === val);
            if (selected) {
              setNetwork(selected);
              onNetworkChange(selected);
            }
          }}
          defaultValue={network?.name}
          value={network?.name}
          options={[
            ...networkList.map((chain) => ({
              label: (
                <Box alignItems="center" gap="2">
                  <NetworkImage chainId={chain.chainId} />
                  <Text>{chain.name}</Text>
                </Box>
              ),
              value: String(chain.name)
            }))
          ]}
        />
      </Box>
    </Box>
  );
}
