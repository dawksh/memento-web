import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { shortenAddress } from '@/lib/utils';
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';

const RightSection = () => {
  const { user } = usePrivy();

  return (
    <div className="w-1/4 h-screen p-4 sticky top-0">
      {user && (
        <div className="bg-background p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              className="w-16 h-16 rounded-full"
              src={`https://avatar.iran.liara.run/public?address=${user.wallet?.address}`}
              alt="Profile picture"
            />
            <div className="flex flex-col">
              <div className="text-lg font-bold">{user.farcaster?.displayName}</div>
              <div className="text-sm text-muted-foreground">
                {shortenAddress(user.wallet?.address!)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSection;
