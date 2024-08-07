import { sequence } from '0xsequence';

export interface Env {
    PROJECT_ACCESS_KEY: string;
    VERIFICATION_URL: string;
    demo_waas_wallet_link_server_db: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    
    const payload = await context.request.json()
    const { nonce, signature, sessionId, chainId }: any = payload

    if (!nonce || !signature || !sessionId || !chainId) {
        return new Response(null, {
            status: 400,
            statusText: "Bad Request",
        });
    }

    let walletAddress = await context.env.demo_waas_wallet_link_server_db.get(nonce)

    if (!walletAddress) {
        return new Response(null, {
            status: 404,
            statusText: "Not Found",
        });
    }

    let authProof = `SessionAuthProof ${sessionId} ${walletAddress} ${nonce}`
    let api = new sequence.api.SequenceAPIClient(
        "https://api.sequence.app",
        context.env.PROJECT_ACCESS_KEY
    )

    let isValid = await api.isValidMessageSignature({
        walletAddress: walletAddress,
        message: authProof,
        signature: signature,
        chainId: chainId
    })

    if (!isValid) {
        return new Response(null, {
            status: 401,
            statusText: "Unauthorized",
        });
    } else {
        return new Response(JSON.stringify({
            walletAddress
        }), {
            status: 200,
            statusText: "OK",
        });
    }
}