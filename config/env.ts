import { z } from 'zod';

const serverSchema = z.object({
});

const clientSchema = z.object({
    NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
    NEXT_PUBLIC_PRIVY_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_API_HOST: z.string().default(''),
    NEXT_PUBLIC_BASE_RPC_URL: z.string().default(''),
});

export const serverEnv = serverSchema.parse(process.env);

export const clientEnv = clientSchema.parse({
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_PRIVY_CLIENT_ID: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST || '',
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL || '',
});

const env = {
    ...serverEnv,
    ...clientEnv,
};

export default env;