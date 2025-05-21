"use client"

import React from 'react'
import ProfileCard, { ProfileCardSkeleton } from '@/components/profile/ProfileCard'
import Post, { PostSkeleton } from '@/components/Feed/Post'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useMoments } from '@/hooks/useMoments'

const ProfilePage = () => {
    const { data: user } = useUser()
    const { data: moments, isLoading } = useMoments({ user: user?.walletAddress, enabled: user?.walletAddress !== undefined })
    return (
        <div className={cn('flex flex-col md:flex-row w-full min-h-screen gap-4 p-4 bg-gray-50')}>
            <section className={cn('w-full md:w-2/5 h-full flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:sticky md:top-8')}>
                {typeof user === 'undefined' ? <ProfileCardSkeleton /> : user && <ProfileCard user={user} />}
            </section>
            <section className={cn('w-full md:w-1/3 flex flex-col gap-4 mx-auto')}>
                {isLoading ? (
                    <>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </>
                ) : moments?.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No posts yet</div>
                ) : (
                    moments?.map(moment => (
                        <Post
                            key={moment.id}
                            imageUrl={moment.assetURL}
                            caption={moment.caption}
                            timestamp={moment.createdAt}
                            user={moment.user}
                            coinAddress={moment.coinAddress}
                            rewards={moment.creatorRewards}
                        />
                    ))
                )}
            </section>
        </div>
    )
}

const Skeleton = () => (
    <div className="w-full px-4 pt-4 pb-4 bg-white rounded-xl shadow animate-pulse flex flex-col gap-4">
        <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-40 w-full bg-gray-200 rounded" />
    </div>
);


export default ProfilePage