import SHA3 from "crypto-js/sha3";

export default function stringToHexAddress(input: string) {
  const hash = SHA3(input, { outputLength: 256 }).toString();
  const address = "0x" + hash.slice(-40);
  return address;
}
