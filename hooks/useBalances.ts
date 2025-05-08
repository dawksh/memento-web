import { useQuery } from "@tanstack/react-query";
import { erc20Abi, formatEther, Address, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import env from "@/config/env";

const publicClient = createPublicClient({
    chain: base,
    transport: http(env.NEXT_PUBLIC_BASE_RPC_URL),
});

export const useBalances = (
    address?: Address,
    coinAddress?: Address,
    enabled: boolean = true
) =>
    useQuery({
        queryKey: ["balances", address, coinAddress],
        queryFn: async () => {
            if (!address) return { native: "0", token: null };
            const native = await publicClient.getBalance({ address });
            if (!coinAddress)
                return { native: formatEther(native), token: null };
            const token = await publicClient.readContract({
                address: coinAddress,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [address],
            });
            return { native: formatEther(native), token: formatEther(token as bigint) };
        },
        enabled: !!address && enabled,
        refetchInterval: 60_000,
        staleTime: 600_000,
    }); 