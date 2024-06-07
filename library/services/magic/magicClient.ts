import { AlgorandExtension } from "@magic-ext/algorand";
import { OAuthExtension } from "@magic-ext/oauth";
import { SolanaExtension } from "@magic-ext/solana";
import { Magic } from "magic-sdk";

// Create client-side Magic instance
const createMagic = (key: string | undefined) => {
  if (!key) {
    throw new Error("Magic publishable key is not defined");
  }

  return (
    typeof window != "undefined" &&
    new Magic(key, {
      // deferPreload: true ,
      extensions: [
        new OAuthExtension(),
        new AlgorandExtension({
          rpcUrl: "", // should remain empty
        }),
        new SolanaExtension({
          rpcUrl: "SOLANA_RPC_NODE_URL",
        }),
      ],
    })
  );
};

const magicKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;
export const magicClient = magicKey ? createMagic(magicKey) : null;
