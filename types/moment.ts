import { User } from "./user";

export type Moment = {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    assetURL: string;
    createHash: string | null;
    userId: string;
    coinAddress: string;
    caption: string;
    user: User;
};