import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useHasPosted() {
    const { user } = usePrivy();
    return useQuery({
        queryKey: ["hasPosted"],
        queryFn: async () => {
            const { data } = await axios.get("/api/user/has-posted", {
                params: {
                    address: user?.wallet?.address
                }
            })
            return data;
        },
        enabled: !!user?.wallet?.address
    })
}
