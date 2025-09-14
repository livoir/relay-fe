import React from "react";
import { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API, TESTNET_RELAY_API } from '@relayprotocol/relay-sdk'
import { mainnet } from 'viem/chains'
import { getClient } from "@relayprotocol/relay-sdk";
import { useAccount, useWalletClient } from "wagmi";

createClient({
  baseApiUrl: MAINNET_RELAY_API,
  // source: "YOUR.SOURCE",
  chains: [convertViemChainToRelayChain(mainnet)]
});

function App() {
  const { address } = useAccount();
  const { data: wallet } = useWalletClient();
  const handleClick = async () => {

    const quote = await getClient()?.actions.getQuote({
      chainId: 1,
      toChainId: 792703809,
      currency: "0x0000000000000000000000000000000000000000",
      toCurrency: "QdyjMr627PR7NtWdcEcgFmDm5haBVUWEcj4jdM4boop",
      amount: "999000000000000", // 0.01 ETH
      // wallet,
      user: "0xB8EC200479a59C695F64601e9B0C696441F119e2", //Replace with your wallet address
      recipient: "HWPf7JFQk5cRnXzgkQTTFQTJVkbMfeCAcGuiMmaf7gqU", //Replace with the recipient address
      tradeType: "EXACT_INPUT",
    });
    console.log("Quote: ", quote);

    await getClient()?.actions.execute({
        quote,
        wallet,
        onProgress: ({
          steps,
          currentStep,
          currentStepItem,
          txHashes,
          details,
          fees,
          breakdown,
        }) => {
          // You can wire this into your UI (toasts, progress bar, etc.)
          console.log("Progress:", {
            currentStep: currentStep?.name,
            currentItem: currentStepItem?.name,
            txHashes,
            details,
            fees,
            breakdown,
            steps,
          });
        },
      });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
      {address ? (
        <p>Connected: {address}</p>
      ) : (
        <p>No wallet connected yet</p>
      )}

      <button onClick={() => console.log(wallet)}>
        Test Wallet Connection
      </button>
    </div>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </div>
  );
}

export default App;