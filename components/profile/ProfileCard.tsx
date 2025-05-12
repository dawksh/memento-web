import React, { useRef, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileUploader } from "react-drag-drop-files";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { fileToDataURL } from "@/lib/imageHelper";
import { uploadImageToCloudinary } from "@/lib/imageHelper";
import axios from "axios";

type ProfileCardProps = {
    user: {
        id: string;
        profileImage?: string;
        walletAddress: string;
        name: string;
        username: string;
        about?: string;
    };
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    const [name, setName] = useState(user.name)
    const [username, setUsername] = useState(user.username)
    const [about, setAbout] = useState(user.about)
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const close = useRef<HTMLButtonElement | null>(null)

    const handleSubmit = async () => {
        const updates: any = {
            userId: user?.id
        }
        if (profileImage) {
            const cloudinaryImage = await uploadImageToCloudinary(await fileToDataURL(profileImage));
            updates.profileImage = cloudinaryImage;
        }
        if (username != user?.username) {
            updates.username = username;
        }
        if (name != user?.name) {
            updates.name = name;
        }
        if (about != user?.about) {
            updates.about = about;
        }

        setLoading(true);
        await axios.post('/api/user', { updates });
        setLoading(false);
        close.current?.click();
    }

    return (
        <div className="w-full flex flex-col items-center bg-white rounded-xl p-6 shadow gap-3">
            <Dialog>
                <img
                    src={
                        user.profileImage ||
                        `https://effigy.im/a/${user.walletAddress}.svg`
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border border-gray-200 mb-2"
                />
                <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                <div className="text-gray-500 text-sm mb-2">@{user.username}</div>
                <div className="text-gray-700 text-center text-sm">
                    {user.about || <span className="text-gray-400">No about info</span>}
                </div>
                <DialogTrigger asChild>
                    {user && (
                        <span className="text-neutral-900/90 text-xs font-medium border-gray-200 border rounded-md px-4 py-2 cursor-pointer">
                            Edit Profile
                        </span>
                    )}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="flex flex-col gap-2">
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription className="flex flex-col gap-2">
                            <Input
                                placeholder="name"
                                className="text-black"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                placeholder="username"
                                className="text-black"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Textarea
                                placeholder="about"
                                className="text-black"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                            />
                            <FileUploader
                                handleChange={(file: File) => setProfileImage(file)}
                                name="file"
                                types={["JPEG", "PNG"]}
                            />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleSubmit} type="submit" disabled={loading}>
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "save"
                            )}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" ref={close}>
                                cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProfileCard;
