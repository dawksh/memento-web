import { User } from "@/types/user";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenAddress = (address: string, chars = 4): string =>
  address ? `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}` : '';

export const getUserProfileImage = (user: User) => user.profileImage || `https://effigy.im/a/${user.walletAddress}.svg`;

export const getMediaLink = (link: string) => link.startsWith("ipfs://") ? link.replace("ipfs://", "https://ipfs.io/ipfs/") : link