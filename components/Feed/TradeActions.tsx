import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { FaFire, FaDollarSign } from "react-icons/fa";

const TradeActions = ({
    balance,
    tokenBalance,
    amount,
    setAmount,
    buyCoin,
    sellCoin,
}: {
    balance: string;
    tokenBalance: string;
    amount: string;
    setAmount: (a: string) => void;
    buyCoin: () => void;
    sellCoin: () => void;
}) => (
    <div className="flex items-center gap-2">
        <Dialog>
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
                                    onClick={() => setAmount(parseFloat(balance).toFixed(4))}
                                >
                                    Balance: {parseFloat(balance).toFixed(4)}
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
        <Dialog>
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
                                    onClick={() => setAmount(parseFloat(tokenBalance).toFixed(4))}
                                >
                                    Balance: {parseFloat(tokenBalance).toFixed(4)}
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

export default TradeActions; 