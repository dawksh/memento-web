import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { shortenAddress } from '@/lib/utils';
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';

const RightSection = () => {
  const { user } = usePrivy();

  return (
    <div className="w-full h-screen p-4 sticky top-0">
      {user && (
        <div className="bg-background rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <img
              className="size-14 rounded-full"
              src={`https://avatar.iran.liara.run/public?address=${user.wallet?.address}`}
              alt="Profile"
            />
            <div>
              <h3 className="font-bold">{user.farcaster?.displayName}</h3>
              <span className="text-xs text-muted-foreground">
                {shortenAddress(user.wallet?.address!)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSection;
