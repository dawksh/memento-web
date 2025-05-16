import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter, DialogContent, DialogTrigger, DialogDescription, DialogTitle, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useUser';
import { shortenAddress } from '@/lib/utils';
import { Loader2, PencilIcon } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react'
import { IoShareSocialSharp } from 'react-icons/io5';
import { isAddress } from 'viem';
import { FileUploader } from "react-drag-drop-files";
import { fileToDataURL, uploadImageToCloudinary } from '@/lib/imageHelper';
import axios from 'axios';
import { User } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';

// Accept user prop
const ProfileCard = ({ user: userProp }: { user?: User }) => {
    const { data: userFetched } = useUser();
    const user = userProp || userFetched;
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const close = useRef<HTMLButtonElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        setUsername(user?.username || '');
        setAbout(user?.about || '');
        setName(user?.name || '');
    }, [user]);

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
        if (user && user.walletAddress) {
            queryClient.invalidateQueries({ queryKey: ["user", user.walletAddress] });
        }
        setLoading(false);
        close.current?.click();
    }

    return (
        <div>
            <Dialog>
                {user && (
                    <div className="w-72 p-4 bg-white rounded-xl outline outline-offset-[-1px] outline-black/5 flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-1.5">
                                <img className="size-8 rounded-full" src={user.profileImage || `https://effigy.im/a/${user.walletAddress}.svg`} alt="Profile" />
                                <div className="text-neutral-900 text-sm font-medium">{isAddress(user.name) ? shortenAddress(user.name, 3) : user.name}</div>
                                <div className="opacity-60">
                                    <span className="text-neutral-900 text-sm font-normal">•</span>
                                    <span className="text-neutral-900 text-sm font-normal"> @{isAddress(user.username) ? shortenAddress(user.username, 3) : user.username}</span>
                                </div>
                            </div>
                            <div className="text-zinc-800 text-sm leading-tight">
                                {user.about != '""' ? user.about : <div className='text-gray-500'>no about</div>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1.5 bg-white rounded-2xl outline  outline-offset-[-1px] outline-neutral-900/5 flex items-center gap-1 hover:cursor-pointer">
                                <PencilIcon className="size-4" />
                                <DialogTrigger asChild>
                                    {user && <span className="text-neutral-900/90 text-xs font-medium">Edit Profile</span>}
                                </DialogTrigger>
                            </div>
                            <button className="px-3 py-1.5 bg-gray-100 cursor-not-allowed rounded-2xl outline outline-offset-[-1px] outline-neutral-900/5 flex items-center gap-1">
                                <IoShareSocialSharp />
                                <span className="text-neutral-900/90 text-xs font-medium">Share Profile</span>
                            </button>
                        </div>
                    </div>
                )}
                <DialogContent>
                    <DialogHeader className='flex flex-col gap-2'>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription className='flex flex-col gap-2'>
                            <Input placeholder='name' className='text-black' value={name} onChange={(e) => setName(e.target.value)} />
                            <Input placeholder='username' className='text-black' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <Textarea placeholder='about' className='text-black' value={about} onChange={(e) => setAbout(e.target.value)} />
                            <FileUploader handleChange={(file: File) => setProfileImage(file)} name="file" types={["JPEG", "PNG"]} />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleSubmit} type="submit" disabled={loading}>{loading ? <Loader2 className='size-4 animate-spin' /> : 'save'}</Button>
                        <DialogClose asChild>
                            <Button variant='outline' ref={close}>cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProfileCard