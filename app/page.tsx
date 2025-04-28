"use client"

import OpenCamera from "@/components/Camera/OpenCamera";
import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import FeedLayout from '@/components/Feed/FeedLayout';

export default function Home() {

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded) sdk.actions.ready()
  }, [loaded])

  return (
    <main>
      <FeedLayout />
      <OpenCamera label="Open Camera" />
    </main>
  );
}
