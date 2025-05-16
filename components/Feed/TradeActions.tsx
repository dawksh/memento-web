import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { FaFire, FaDollarSign } from "react-icons/fa";
import { useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { getClients } from "@/lib/wallet";
import { tradeCoin } from "@zoralabs/coins-sdk";
import {
    Address,
    Hex,
    parseEther,
} from "viem";
import { useBalances } from "@/hooks/useBalances";
import { toast } from "sonner";

const TradeActions = ({ coinAddress }: { coinAddress: string }) => {
    const { wallets } = useWallets();
    const [amount, setAmount] = useState("0");
    const [buyOpen, setBuyOpen] = useState(false);
    const [sellOpen, setSellOpen] = useState(false);
    const address = wallets[0]?.address as Address | undefined;
    const { data: balances } = useBalances(address, coinAddress as Address, !!address);

    const handleBuyOpen = (open: boolean) => setBuyOpen(open);
    const handleSellOpen = (open: boolean) => setSellOpen(open);

    const buyCoin = useCallback(async () => {
        const wallet = wallets[0];
        if (!wallet) return;
        await wallet.switchChain(base.id);
        const provider = await wallet.getEthereumProvider();
        const { publicClient, walletClient } = getClients(provider, wallet.address as Hex);
        const buyParams = {
            direction: "buy" as const,
            target: coinAddress as Address,
            args: {
                recipient: wallet.address as Address,
                orderSize: parseEther(amount),
                tradeReferrer: "0x000dDd385E319F9d797F945D1d774fc2bC170AD1" as Address,
            },
        };
        const { hash } = await tradeCoin(buyParams, walletClient, publicClient);
        toast.success("Successfully bought coin", {
            icon: "🎉",
            id: `buy-${hash}`
        });
    }, [wallets, coinAddress, amount]);

    const sellCoin = useCallback(async () => {
        const wallet = wallets[0];
        if (!wallet) return;
        await wallet.switchChain(base.id);
        const provider = await wallet.getEthereumProvider();
        const { publicClient, walletClient } = getClients(provider, wallet.address as Hex);
        const sellParams = {
            direction: "sell" as const,
            target: coinAddress as Address,
            args: {
                recipient: wallet.address as Address,
                orderSize: parseEther(amount),
            },
        };
        const { hash } = await tradeCoin(sellParams, walletClient, publicClient);
        toast.success("Successfully sold coin", {
            icon: "🎉",
            id: `sell-${hash}`
        });
    }, [wallets, coinAddress, amount]);

    return (
        <div className="flex items-center gap-2">
            <Dialog open={buyOpen} onOpenChange={handleBuyOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-red-400 flex items-center gap-1 px-3 py-1.5 hover:cursor-pointer"
                    >
                        <div className="size-4 relative overflow-hidden">
                            <FaFire fill="red" />
                        </div>
                        <span className="text-xs font-medium">Ape In</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-xl shadow-lg p-6">
                    <DialogTitle className="text-xl font-bold">Ape Into Coin</DialogTitle>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                                    Amount (ETH)
                                </label>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-xs text-gray-500 cursor-pointer"
                                        onClick={() => setAmount(parseFloat(balances?.native || "0").toFixed(4))}
                                    >
                                        Balance: {parseFloat(balances?.native || "0").toFixed(4)}
                                    </span>
                                </div>
                            </div>
                            <input
                                id="amount"
                                type="number"
                                step="0.0001"
                                min="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="0.0"
                            />
                        </div>
                        <Button onClick={buyCoin} className="bg-red-400 text-white hover:bg-red-500 transition-colors">
                            <FaFire /> Ape In
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={sellOpen} onOpenChange={handleSellOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-green-500 flex items-center gap-1 px-3 py-1.5 hover:cursor-pointer"
                    >
                        <div className="size-4 relative overflow-hidden">
                            <FaDollarSign fill="green" />
                        </div>
                        <span className="text-xs font-medium">Cash Out</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-xl shadow-lg p-6">
                    <DialogTitle className="text-xl font-bold">Cash Out Coin</DialogTitle>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label htmlFor="sellAmount" className="text-sm font-medium text-gray-700">
                                    Amount (Coin)
                                </label>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-xs text-gray-500 cursor-pointer"
                                        onClick={() => setAmount(parseFloat(balances?.token || "0").toFixed(4))}
                                    >
                                        Balance: {parseFloat(balances?.token || "0").toFixed(4)}
                                    </span>
                                </div>
                            </div>
                            <input
                                id="sellAmount"
                                type="number"
                                step="0.0001"
                                min="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="0.0"
                            />
                        </div>
                        <Button onClick={sellCoin} className="bg-green-500 text-white hover:bg-green-600 transition-colors">
                            <FaDollarSign /> Cash Out
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TradeActions; 