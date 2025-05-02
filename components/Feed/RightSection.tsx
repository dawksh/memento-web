import React from 'react';
import { PencilIcon } from 'lucide-react';
import { IoShareSocialSharp } from "react-icons/io5";
import { useUser } from '@/hooks/useUser';
import { isAddress } from 'viem';
import { shortenAddress } from '@/lib/utils';


const RightSection = () => {
  const { data: user } = useUser();

  return (
    <div className="w-full h-screen p-4 sticky top-0">
      {user && (
        <div className="w-72 p-4 bg-white rounded-xl outline outline-offset-[-1px] outline-black/5 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <img className="size-8 rounded-full" src={user.profileImage || `https://effigy.im/a/${user.walletAddress}.svg`} alt="Profile" />
              <div className="text-neutral-900 text-sm font-medium">{isAddress(user.name) ? shortenAddress(user.name, 3) : user.name}</div>
              <div className="opacity-60">
                <span className="text-neutral-900 text-sm font-normal">•</span>
                <span className="text-neutral-900 text-sm font-normal"> @{isAddress(user.username) ? shortenAddress(user.username, 3) : user.username}</span>
              </div>
            </div>
            <div className="text-zinc-800 text-sm leading-tight">
              {user.about != "\"\"" ? user.about : <div className='text-gray-500'>no about</div>}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white rounded-2xl outline  outline-offset-[-1px] outline-neutral-900/5 flex items-center gap-1">
              <PencilIcon className="size-4" />
              <span className="text-neutral-900/90 text-xs font-medium">Edit Profile</span>
            </button>
            <button className="px-3 py-1.5 bg-white rounded-2xl outline outline-offset-[-1px] outline-neutral-900/5 flex items-center gap-1">
              <IoShareSocialSharp />
              <span className="text-neutral-900/90 text-xs font-medium">Share Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSection;
