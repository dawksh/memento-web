
import sdk from "@farcaster/frame-sdk";
import { useQuery } from "@tanstack/react-query";

export const useFarcasterContext = () => {
    return useQuery({
        queryKey: ["fc-ctx"],
        queryFn: async () => {
            try {
                const context = await sdk.context
                return context
            } catch (error) {
                return null
            }
        },
        enabled: true,
        staleTime: 60_000,
    });
};

