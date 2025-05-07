import React, { useRef, useEffect, useState } from "react";
import { FaFire, FaDollarSign } from "react-icons/fa";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { User } from "@/types/user";
import {
  Address,
  createPublicClient,
  erc20Abi,
  formatEther,
  Hex,
  http,
  isAddress,
  parseEther,
} from "viem";
import { getMediaLink, getUserProfileImage, shortenAddress } from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { tradeCoin } from "@zoralabs/coins-sdk";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getClients } from "@/lib/wallet";
interface PostProps {
  imageUrl: string;
  caption: string;
  timestamp: string;
  user: User;
  coinAddress: string;
}

const Post = ({
  imageUrl,
  timestamp,
  caption,
  user,
  coinAddress,
}: PostProps) => {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [, setImageDimensions] = useState({ width: 0, height: 0 });
  const { wallets } = useWallets();
  const [balance, setBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [amount, setAmount] = useState("0");

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  useEffect(() => {
    const styleId = `style-${imageUrl.replace(/[^a-zA-Z0-9]/g, "")}`;

    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
      .post-image-container-${styleId} {
        position: relative;
        overflow: hidden;
      }
      
      .post-image-container-${styleId}::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("${getMediaLink(imageUrl)}");
        background-position: center;
        background-size: cover;
        filter: blur(10px);
        opacity: 0.5;
        z-index: 0;
      }
      
      .post-image-container-${styleId} img {
        position: relative;
        z-index: 1;
        display: block;
        margin: 0 auto;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      if (document.getElementById(styleId)) {
        document.getElementById(styleId)?.remove();
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!wallets[0]) return;
    publicClient
      .getBalance({ address: wallets[0].address as Address })
      .then((bal) => setBalance(formatEther(bal)));
  }, [wallets, publicClient]);

  useEffect(() => {
    if (!wallets[0]) return;
    publicClient
      .readContract({
        address: coinAddress as Address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [wallets[0].address as Address],
      })
      .then((bal) => setTokenBalance(formatEther(bal)));
  }, [wallets, publicClient]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setImageLoaded(true);
  };

  const buyCoin = async () => {
    const wallet = wallets[0];
    await wallet.switchChain(base.id);
    const provider = await wallet.getEthereumProvider();
    const { publicClient, walletClient } = getClients(
      provider,
      wallet.address as Hex
    );

    const buyParams = {
      direction: "buy" as const,
      target: coinAddress as Address,
      args: {
        recipient: wallet.address as Address,
        orderSize: parseEther(amount),
        tradeReferrer:
          "0x000dDd385E319F9d797F945D1d774fc2bC170AD1" as Address,
      },
    };

    const { hash } = await tradeCoin(buyParams, walletClient, publicClient);
  };
  const sellCoin = async () => {
    const wallet = wallets[0];
    await wallet.switchChain(base.id);
    const provider = await wallet.getEthereumProvider();
    const { publicClient, walletClient } = getClients(
      provider,
      wallet.address as Hex
    );

    const sellParams = {
      direction: "sell" as const,
      target: coinAddress as Address,
      args: {
        recipient: wallet.address as Address,
        orderSize: parseEther(amount),
        tradeReferrer:
          "0x000dDd385E319F9d797F945D1d774fc2bC170AD1" as Address,
      },
    };

    const { hash } = await tradeCoin(
      sellParams,
      walletClient,
      publicClient
    );
  };

  // Generate a clean class name from the imageUrl
  const containerClassName = `post-image-container-style-${imageUrl.replace(
    /[^a-zA-Z0-9]/g,
    ""
  )}`;

  return (
    <div className="w-full px-4 pt-4 pb-4 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] inline-flex flex-col justify-start items-start gap-5 overflow-hidden">
      {/* User Header */}
      <div className="self-stretch flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            className="size-6 rounded-full"
            src={getUserProfileImage(user)}
            alt={`${user}'s profile`}
          />
          <div className="text-neutral-900 text-sm font-bold leading-tight">
            {isAddress(user.username)
              ? shortenAddress(user.username)
              : user.username}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(timestamp), "MMM d, yyyy")}
        </div>
      </div>

      {/* Caption */}
      <div className="self-stretch text-sm text-neutral-800">
        {caption}
      </div>

      {/* Post Image with Background Blur */}
      <div
        ref={imageContainerRef}
        className={`self-stretch ${containerClassName}`}
        style={{
          minHeight: imageLoaded ? "auto" : "200px",
          borderRadius: "0.375rem",
        }}
      >
        <img
          className="w-full rounded-md"
          style={{
            maxHeight: "40vh",
            objectFit: "contain",
            aspectRatio: "auto",
          }}
          src={getMediaLink(imageUrl)}
          alt={caption}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Action Buttons */}
      <div className="self-stretch flex justify-between items-center">
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
                <span className="text-xs font-medium">
                  Ape In
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-xl shadow-lg p-6">
              <DialogTitle className="text-xl font-bold">
                Ape Into Coin
              </DialogTitle>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="amount"
                      className="text-sm font-medium text-gray-700"
                    >
                      Amount (ETH)
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs text-gray-500 cursor-pointer"
                        onClick={() => {
                          setAmount(
                            parseFloat(
                              balance
                            ).toFixed(4)
                          );
                        }}
                      >
                        Balance:{" "}
                        {parseFloat(balance).toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <input
                    id="amount"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="0.0"
                  />
                </div>
                <Button
                  onClick={buyCoin}
                  className="bg-red-400 text-white hover:bg-red-500 transition-colors"
                >
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
              <DialogTitle className="text-xl font-bold">
                Cash Out Coin
              </DialogTitle>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="sellAmount"
                      className="text-sm font-medium text-gray-700"
                    >
                      Amount (Coin)
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs text-gray-500 cursor-pointer"
                        onClick={() => {
                          setAmount(
                            parseFloat(
                              tokenBalance
                            ).toFixed(4)
                          );
                        }}
                      >
                        Balance:{" "}
                        {parseFloat(tokenBalance).toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <input
                    id="sellAmount"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="0.0"
                  />
                </div>
                <Button
                  onClick={sellCoin}
                  className="bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  <FaDollarSign /> Cash Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-1.5 bg-white rounded-2xl outline outline-offset-[-1px] outline-black/5 flex items-center">
          <button
            className="hover:cursor-pointer"
            onClick={() =>
              window.open(
                `https://zora.co/coin/base:${coinAddress}`,
                "_blank"
              )
            }
          >
            <img
              className="size-4"
              alt="Zora logo"
              src="https://res.cloudinary.com/metapass/image/upload/v1746199815/ourzora_logo_bshnqs.jpg"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
