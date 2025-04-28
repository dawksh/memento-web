"use client"

import React from 'react';
import Post from './Post';

const MainFeed = () => {
  // Example posts - in a real app, this would come from a data source
  const posts = [
    {
      imageUrl: "https://picsum.photos/800/600",
      caption: "Example post 1",
      timestamp: Date.now(),
      username: "daksh"
    },
    {
      imageUrl: "https://picsum.photos/800/601",
      caption: "Example post 2",
      timestamp: Date.now(),
      username: "daksh"
    }
  ];

  return (
    <div className="w-2/5 mx-auto p-4 border-x border-gray-200">
      <div className="space-y-6">
        {posts.map((post, index) => (
          <Post
            key={index}
            imageUrl={post.imageUrl}
            caption={post.caption}
            timestamp={post.timestamp}
            username={post.username}
          />
        ))}
      </div>
    </div>
  );
};

export default MainFeed;
