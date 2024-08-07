import { ethers } from 'ethers'

export const onRequest: PagesFunction = async (context) => {
  const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32))

  return new Response(JSON.stringify({
    nonce
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}