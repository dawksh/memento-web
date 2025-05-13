"use client";

import React from "react";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/hooks/useUser";
import sdk from "@farcaster/frame-sdk";
import { useFarcasterContext } from "@/hooks/useFarcasterContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Navbar = () => {
    const { login, logout, authenticated } = usePrivy();
    const { data: user } = useUser()
    const router = useRouter()

    const { data: fcCtx } = useFarcasterContext()

    const renderSaveFcButton = () => {
        if (!fcCtx) return null;

        return fcCtx.client.added ? null : (
            <Button
                onClick={() => sdk.actions.addFrame()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
                variant="outline"
            >
                Save App
            </Button>
        );
    };

    return (
        <div className="flex flex-row justify-between items-center p-4 sticky md:relative top-0 bg-white z-50">
            <Link href="/" className="italic font-semibold">momnt</Link>
            {renderSaveFcButton()}
            <div>
                {authenticated ? (
                    <div className="flex flex-row items-center gap-2">
                        <Avatar className="md:hidden" onClick={() => router.push(`/profile/${user?.walletAddress}`)}>
                            <AvatarImage src={user?.profileImage || `https://effigy.im/a/${user?.walletAddress}.svg`} />
                        </Avatar>
                        <Button onClick={logout}>logout</Button>
                    </div>
                ) : (
                    <Button className="hover:cursor-pointer" onClick={login}>
                        login
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
