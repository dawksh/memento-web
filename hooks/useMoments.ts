import { Moment } from "@/types/moment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMoments({ coin, user, enabled }: { coin?: string, user?: string, enabled?: boolean }) {
    return useQuery({
        queryKey: ["moments", coin, user],
        queryFn: async () => {
            const { data } = await axios.get<Moment[]>("/api/moments", { params: { coin, user } })
            return data
        },
        refetchInterval: 60000 * 1,
        staleTime: 600000,
        enabled: enabled ?? true,
    })
}
