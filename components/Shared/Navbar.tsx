"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { usePrivy } from "@privy-io/react-auth";
import OpenCamera from "../Camera/OpenCamera";

const getTimeLeft = (target: number) => {
    const diff = Math.max(target - Date.now(), 0);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
};

const Navbar = () => {
    const { login, logout, authenticated } = usePrivy();
    const [target] = useState(() => Date.now() + 3 * 60 * 60 * 1000); // 3h from now
    const [{ h, m, s }, setTime] = useState(getTimeLeft(target));

    useEffect(() => {
        const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
        return () => clearInterval(id);
    }, [target]);

    return (
        <div className="flex flex-row justify-between items-center p-4">
            <div className="italic font-semibold">momnt</div>

            {authenticated && (
                <div className="border border-gray-200 px-8 py-2 rounded-3xl">
                    <OpenCamera
                        label={`post • ${h}h ${m}m ${s}s`}
                        props={{ className: "text-sm text-semibold hover:cursor-pointer" }}
                    />
                </div>
            )}

            <div>
                {authenticated ? (
                    <>
                        <Button onClick={logout}>logout</Button>
                    </>
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
