import React from "react";
import { FaFire, FaDollarSign } from "react-icons/fa";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { User } from "@/types/user";
import { isAddress } from "viem";
import { getMediaLink, getUserProfileImage, shortenAddress } from "@/lib/utils";

interface PostProps {
  imageUrl: string;
  caption: string;
  timestamp: string;
  user: User;
  coinAddress: string
}

const Post = ({ imageUrl, timestamp, caption, user, coinAddress }: PostProps) => {
  return (
    <div className="w-full px-4 pt-4 pb-4 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      {/* User Header */}
      <div className="self-stretch flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            className="size-6 rounded-full"
            src={getUserProfileImage(user)}
            alt={`${user}'s profile`}
          />
          <div className="text-neutral-900 text-sm font-bold leading-tight">
            {isAddress(user.username) ? shortenAddress(user.username) : user.username}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(timestamp), 'MMM d, yyyy')}
        </div>
      </div>

      {/* Caption */}
      <div className="self-stretch text-sm text-neutral-800">
        {caption}
      </div>

      {/* Post Image */}
      <img
        className="self-stretch h-64 rounded-md object-cover"
        src={getMediaLink(imageUrl)}
        alt={caption}
      />


      {/* Action Buttons */}
      <div className="self-stretch flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl border-red-400 flex items-center gap-1 px-3 py-1.5 hover:cursor-pointer"
          >
            <div className="size-4 relative overflow-hidden">
              <FaFire fill="red" />
            </div>
            <span className="text-xs font-medium">Ape In</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl border-green-500 flex items-center gap-1 px-3 py-1.5 hover:cursor-pointer"
          >
            <div className="size-4 relative overflow-hidden">
              <FaDollarSign fill="green" />
            </div>
            <span className="text-xs font-medium">Cash Out</span>
          </Button>
        </div>

        <div className="p-1.5 bg-white rounded-2xl outline outline-offset-[-1px] outline-black/5 flex items-center">
          <button onClick={() => window.open(`https://zora.co/coin/base:${coinAddress}`, "_blank")}>
            <img
              className="size-4"
              alt="Zora logo"
              src="https://res.cloudinary.com/metapass/image/upload/v1746199815/ourzora_logo_bshnqs.jpg"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
