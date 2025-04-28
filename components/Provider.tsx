'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="cma0tzk2x002jic0melaac6jy"
            clientId="client-WY6L5yeu36R4Cb5NRRjvbcV8moUYwGthynJbrALy4czrt"
            config={{
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets'
                }
            }}
        >
            {children}
        </PrivyProvider>
    );
}