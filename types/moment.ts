import { User } from "./user";

export type Moment = {
    id: string;
    title: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    assetURL: string; // Cloudinary URL
    createHash: string | null;
    userId: string; // UUID
    coinAddress: string; // Ethereum address
    caption: string;
    user: User;
    creatorRewards: string; // Decimal string
};