import { Magic } from "@magic-sdk/admin";

// Initiating Magic instance for server-side methods
export const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);
