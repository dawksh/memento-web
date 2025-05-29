"use client"

import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import FeedLayout from '@/components/Feed/FeedLayout';
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import { usePrivy } from "@privy-io/react-auth";

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

  const { ready, authenticated } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();

  useEffect(() => {
    if (ready && !authenticated) {
      const login = async () => {
        const { nonce } = await initLoginToFrame();
        const result = await sdk.actions.signIn({ nonce: nonce });
        await loginToFrame({
          message: result.message,
          signature: result.signature,
        });
      };
      login();
    }
  }, [ready, authenticated]);

  return (
    <main>
      <FeedLayout />
    </main>
  );
}
