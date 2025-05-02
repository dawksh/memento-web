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
      user: "daksh"
    },
    {
      imageUrl: "https://picsum.photos/800/601",
      caption: "Example post 2",
      timestamp: Date.now(),
      user: "daksh"
    },
    {
      imageUrl: "https://picsum.photos/800/606",
      caption: "Example post 3",
      timestamp: Date.now(),
      user: "daksh"
    },
    {
      imageUrl: "https://picsum.photos/800/603",
      caption: "Example post 4",
      timestamp: Date.now(),
      user: "daksh"
    }
  ];

  return (
    <div className="w-5/6 md:w-3/5 mx-auto p-2">
      <div className="space-y-2">
        {posts.map((post, index) => (
          <Post
            key={index}
            imageUrl={post.imageUrl}
            caption={post.caption}
            timestamp={post.timestamp}
            user={post.user}
          />
        ))}
      </div>
    </div>
  );
};

export default MainFeed;
