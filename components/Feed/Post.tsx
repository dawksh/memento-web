import React from 'react';
import { FaFire, FaDollarSign, FaExternalLinkAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface PostProps {
  imageUrl: string;
  caption: string;
  timestamp: number;
  username: string;
}

const Post = ({ imageUrl, caption, timestamp, username }: PostProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 hover:shadow-md transition-shadow duration-200">
      <img
        src={imageUrl}
        alt="Post"
        className="w-full h-[400px] object-cover rounded-t-lg"
      />
      <div className="p-4">
        <div className="flex justify-between items-center gap-2 mb-2">
          <p className="text-sm text-gray-600">{username}</p>
          <p className="text-sm text-gray-600">{format(new Date(timestamp), 'yyyy/MM/dd HH:mm')}</p>
        </div>
        <p className="text-lg font-semibold text-gray-800 mb-4">{caption}</p>
        <div className="flex justify-between items-center gap-2">
          <Button className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-200 text-red-700 hover:bg-red-200 transition-colors">
            <FaFire />
            <span>Ape In</span>
          </Button>
          <Button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-200 transition-colors">
            <FaExternalLinkAlt />
            <span>View on Zora</span>
          </Button>
          <Button className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-200 text-green-700 hover:bg-green-200 transition-colors">
            <FaDollarSign />
            <span>Cash Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Post;
