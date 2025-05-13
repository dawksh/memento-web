import env from "@/config/env";
import axios from "axios";

export const backend = axios.create({
    baseURL: env.NEXT_PUBLIC_API_HOST,
    headers: {
        "x-api-key": env.FE_API_KEY,
    }
})
