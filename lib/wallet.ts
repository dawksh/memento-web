import { EIP1193Provider } from "@privy-io/react-auth"
import { Hex } from "viem"
import { createWalletClient } from "viem"
import { custom } from "viem"
import { createPublicClient } from "viem"
import { base } from "viem/chains"

const getClients = (provider: EIP1193Provider, address?: Hex) => {
    const publicClient = createPublicClient({
        chain: base,
        transport: custom(provider)
    })
    const walletClient = createWalletClient({
        account: address,
        chain: base,
        transport: custom(provider)
    })
    return { publicClient, walletClient }
}

export { getClients }
