"use client"

import React, { useEffect } from 'react';
import Post from './Post';
import { useMoments } from '@/hooks/useMoments';

const MainFeed = () => {

  const { data: posts } = useMoments()

  return (
    <div className="w-5/6 md:w-3/5 mx-auto p-2">
      <div className="space-y-2">
        {posts && posts?.map((post, index) => (
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
