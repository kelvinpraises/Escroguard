import { OAuthExtension } from "@magic-ext/oauth";
import { Magic } from "magic-sdk";

// Create client-side Magic instance
const createMagic = (key: string | undefined) => {
  if (!key) {
    throw new Error("Magic publishable key is not defined");
  }

  return (
    typeof window != "undefined" &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
    })
  );
};

const magicKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;
export const magic = magicKey ? createMagic(magicKey) : null;
