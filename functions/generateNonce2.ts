import { ethers } from 'ethers'
import { URL } from "url";

export interface Env {
    demo_waas_wallet_link_server_db: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {

  const payload = await context.request.json()
  const { walletAddress }: any = payload

  if (!walletAddress) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32))

  // await env.demo_waas_wallet_link_server_db.put(nonce, walletAddress)

  return new Response(JSON.stringify({
    nonce
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}