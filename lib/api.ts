import env from "@/config/env";
import axios from "axios";

export const backend = axios.create({
    baseURL: env.NEXT_PUBLIC_API_HOST
})
