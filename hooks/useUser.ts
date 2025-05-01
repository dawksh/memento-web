import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUser(address?: string) {
    const { user } = usePrivy()
    if (user && user.wallet && !address) address = user.wallet?.address
    return useQuery({
        queryKey: ["user", address],
        queryFn: async () => {
            const { data } = await axios.get("/api/user", { params: { address } })
            return data
        },
        refetchInterval: 600,
        staleTime: 600000, // 10 minutes in milliseconds
        enabled: !!address,
    })
}
