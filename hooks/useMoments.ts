import { Moment } from "@/types/moment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMoments({
    coin,
    user,
    enabled,
    page = 1,
    limit = 10
}: {
    coin?: string,
    user?: string,
    enabled?: boolean,
    page?: number,
    limit?: number
}) {
    return useQuery({
        queryKey: ["moments", coin, user, page, limit],
        queryFn: async () => {
            const { data } = await axios.get<{ data: Moment[], pagination: any }>("/api/moments", {
                params: { coin, user, page, limit }
            })
            return { posts: data.data, pagination: data.pagination }
        },
        refetchInterval: 60000 * 1,
        staleTime: 600000,
        enabled: enabled ?? true,
    })
}
