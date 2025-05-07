"use client";

import React from "react";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/hooks/useUser";

const Navbar = () => {
    const { login, logout, authenticated } = usePrivy();
    const { data: user } = useUser()

    return (
        <div className="flex flex-row justify-between items-center p-4 sticky md:relative top-0 bg-white z-50">
            <div className="italic font-semibold">momnt</div>

            <div>
                {authenticated ? (
                    <div className="flex flex-row items-center gap-2">
                        <Avatar className="md:hidden">
                            <AvatarImage src={user?.profileImage || `https://effigy.im/a/${user?.walletAddress}.svg`} />
                            <AvatarFallback>CN</AvatarFallback>
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
