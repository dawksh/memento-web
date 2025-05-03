"use client"

import React from 'react';
import Post from './Post';
import { useMoments } from '@/hooks/useMoments';

const Skeleton = () => (
  <div className="w-full px-4 pt-4 pb-4 bg-white rounded-xl shadow animate-pulse flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <div className="size-6 rounded-full bg-gray-200" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
    <div className="h-4 w-3/4 bg-gray-200 rounded" />
    <div className="h-40 w-full bg-gray-200 rounded" />
  </div>
);

const MainFeed = () => {
  const { data: posts, isLoading } = useMoments();

  return (
    <div className="w-5/6 md:w-3/5 mx-auto p-2">
      <div className="space-y-2">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)}
        {!isLoading && posts && posts.length === 0 && (
          <div className="text-center text-gray-400 py-8">No posts yet</div>
        )}
        {!isLoading && posts && posts.map((post, index) => (
          <Post
            key={index}
            imageUrl={post.assetURL}
            caption={post.caption}
            timestamp={post.createdAt}
            user={post.user}
            coinAddress={post.coinAddress}
          />
        ))}
      </div>
    </div>
  );
};

export default MainFeed;
