import type { MagicSDKAdditionalConfiguration } from "@magic-sdk/provider";
import { createConnector } from "@wagmi/core";
import { Magic, type EthNetworkConfiguration } from "magic-sdk";
import { UserRejectedRequestError, getAddress } from "viem";

export interface MagicConnectorParams {
  apiKey: string;
  magicSdkConfiguration?: MagicSDKAdditionalConfiguration;
  networks?: EthNetworkConfiguration[];
}

class ProviderNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "Provider not found");
    this.name = "ProviderNotFoundError";
  }
}

class SwitchChainError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to switch chain");
    this.name = "SwitchChainError";
  }
}

class ChainNotConfiguredError extends Error {
  constructor(message?: string) {
    super(message ?? "Chain not configured");
    this.name = "ChainNotConfiguredError";
  }
}

export function magicWalletConnector({
  apiKey,
  magicSdkConfiguration,
  networks,
}: MagicConnectorParams) {
  // Define a function to get the type of rpcProvider
  function getMagicInstance(apiKey: string, config: any) {
    return new Magic(apiKey, config);
  }

  // Get the type of rpcProvider
  type MagicInstance = ReturnType<typeof getMagicInstance>;
  type RPCProviderType = MagicInstance["rpcProvider"];

  console.log("This is the Magic wallet??");

  let connect: any;

  let magicInstance: MagicInstance | null = null;

  return createConnector<RPCProviderType>((config) => ({
    icon: "https://magic.link/favicon.ico",
    id: "magicWallet",
    name: "Magic Wallet",
    type: "injected" as const,
    supportsSimulation: false,

    async setup() {
      const provider = await this.getProvider();
      // Only start listening for events if `target` is set, otherwise `injected()` will also receive events
      if (provider && apiKey) {
        if (!connect) {
          connect = this.onConnect!.bind(this);
          provider.on("connect", connect);
        }

        // We shouldn't need to listen for `'accountsChanged'` here since the `'connect'` event should suffice (and wallet shouldn't be connected yet).
        // Some wallets, like MetaMask, do not implement the `'connect'` event and overload `'accountsChanged'` instead.
        // if (!accountsChanged) {
        //   accountsChanged = this.onAccountsChanged.bind(this)
        //   provider.on('accountsChanged', accountsChanged)
        // }
      }
    },

    async connect({ chainId, isReconnecting } = {}) {
      if (!apiKey) {
        throw new Error("Magic API Key is not provided.");
      }

      const provider = await this.getProvider();

      if (!provider) {
        throw new ProviderNotFoundError("Failed to connect to Magic Wallet");
      }
      if (provider?.on) {
        provider.on("accountsChanged", this.onAccountsChanged.bind(this));
        provider.on("chainChanged", this.onChainChanged.bind(this));
        provider.on("disconnect", this.onDisconnect.bind(this));
      }
      let currentChainId: number;
      try {
        currentChainId = await this.getChainId();
      } catch {
        currentChainId = 0;
      }

      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain!({ chainId }).catch((error) => {
          if (error.code === UserRejectedRequestError.code) throw error;
          return { id: currentChainId };
        });
        currentChainId = chain?.id ?? currentChainId;
      }

      const accounts = await this.getAccounts();
      this.onConnect!({ chainId: currentChainId.toString() });
      if (await this.isAuthorized()) {
        return {
          chainId: currentChainId,
          accounts,
        };
      }
      throw new UserRejectedRequestError(Error("User Rejected Request"));
    },

    async disconnect() {
      this.onDisconnect();
    },

    async getAccounts() {
      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: "eth_accounts",
      });
      return accounts;
    },

    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request({
        method: "eth_chainId",
      });
      return parseInt(chainId, 16);
    },

    async getProvider() {
      if (!magicInstance) {
        magicInstance = new Magic(apiKey, {
          ...magicSdkConfiguration,
          network: magicSdkConfiguration?.network ?? networks?.[0],
        });
      }
      return magicInstance.rpcProvider;
    },

    async isAuthorized() {
      try {
        if (!magicInstance) {
          return false;
        }
        // TODO: get login
        return true;
      } catch {
        return false;
      }
    },

    async switchChain({ addEthereumChainParameter, chainId }) {
      const chain = config.chains?.find((chain) => chain.id === chainId);
      if (!chain)
        throw new ChainNotConfiguredError(`Unsupported chain ID: ${chainId}`);

      console.log(chain);

      try {
        magicInstance = new Magic(apiKey, {
          ...magicSdkConfiguration,
          network: {
            rpcUrl: chain.rpcUrls.default.http[0],
            chainId: chain.id,
          },
        });

        const provider = await this.getProvider();

        const chainIdd = await provider.request({ method: "eth_chainId" });
        const networkId = await provider.request({ method: "net_version" });

        console.log(`Chain ID: ${chainIdd}`);
        console.log(`Network ID: ${networkId}`);

        this.onChainChanged(chainId.toString());
        return chain;
      } catch (error) {
        if (error instanceof UserRejectedRequestError) {
          throw error;
        }
        throw new SwitchChainError(`Failed to switch to chain ID: ${chainId}`);
      }
    },

    onAccountsChanged(accounts: `0x${string}`[]) {
      if (accounts.length === 0 || !accounts[0]) {
        this.onDisconnect();
      } else {
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
      }
    },

    onChainChanged(chainId: string) {
      const chain = config.chains?.find(
        (chain) => chain.id === Number(chainId)
      );
      if (chain) {
        config.emitter.emit("change", { chainId: Number(chainId) });
      }
    },

    async onConnect(c) {
      config.emitter.emit("connect", {
        chainId: Number(c.chainId),
        accounts: await this.getAccounts(),
      });
    },

    onDisconnect() {
      config.emitter.emit("disconnect");
    },
  }));
}
