'use client';

import env from '@/config/env';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryProvider } from '@/app/providers/QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
            clientId={env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
            config={{
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets'
                }
            }}
        >
            <QueryProvider>
                {children}
            </QueryProvider>
        </PrivyProvider>
    );
}