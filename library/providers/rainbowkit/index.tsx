import { RainbowKitProvider as _RainbowKitProvider } from "@rainbow-me/rainbowkit";

const RainbowKitProvider = ({ children }: { children: React.ReactNode }) => {
  // NOTE: The chains is passed in by WagmiProvider
  return <_RainbowKitProvider coolMode chains={[]}>{children}</_RainbowKitProvider>;
};

export default RainbowKitProvider;
