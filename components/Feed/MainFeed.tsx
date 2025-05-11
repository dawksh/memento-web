"use client";

import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useMoments } from "@/hooks/useMoments";
import OpenCamera from "../Camera/OpenCamera";
import { usePrivy } from "@privy-io/react-auth";
import { Camera } from "lucide-react";

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

const getTimeLeft = (target: number) => {
  const diff = Math.max(target - Date.now(), 0);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
};

const MainFeed = () => {
  const { data: posts, isLoading } = useMoments({});
  const { authenticated } = usePrivy();


  return (
    <div className="w-5/6 md:w-3/5 mx-auto p-2">
      <div className="space-y-2">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        {!isLoading && posts && posts.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No posts yet
          </div>
        )}
        {authenticated && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-black text-white shadow-lg rounded-full px-6 py-3 hover:scale-105 transition-transform">
              <OpenCamera
                label={<PostButton />}
                props={{
                  className:
                    "text-sm font-semibold hover:cursor-pointer",
                }}
              />
            </div>
          </div>
        )}
        {!isLoading &&
          posts &&
          posts.map((post, index) => (
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


const PostButton = () => {
  // const [target] = useState(() => Date.now() + 3 * 60 * 60 * 1000);

  // useEffect(() => {
  //   const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
  //   return () => clearInterval(id);
  // }, [target]);
  // const [{ h, m, s }, setTime] = useState(getTimeLeft(target));
  return (
    <div className="bg-black text-white shadow-lg rounded-full px-1 py-2 hover:scale-105 transition-transform">
      <Camera />
    </div>
  )
}

export default MainFeed;
