"use client"

import OpenCamera from "@/components/Camera/OpenCamera";
import SnapCamera from "@/components/Camera/SnapCamera";
import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

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
    <div className="flex justify-center items-center">
      <OpenCamera label="Open" />
    </div>
  );
}
