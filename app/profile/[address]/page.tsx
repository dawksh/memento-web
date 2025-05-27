
"use client"

import React from 'react'
import ProfileCard from '@/components/profile/ProfileCard'
import Post from '@/components/Feed/Post'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useMoments } from '@/hooks/useMoments'
import { useParams } from 'next/navigation'
import { isAddress } from 'viem'
const ProfilePage = () => {
    const { address } = useParams()
    const { data: user } = useUser(address as string)
    const { data: moments } = useMoments({ user: user?.walletAddress })

    if (!isAddress(address as string)) {
        return <div>Invalid profile</div>
    }

    return (
        <div className={cn('flex flex-col md:flex-row w-full min-h-screen gap-4 p-4 bg-gray-50')}>
            <section className={cn('w-full md:w-2/5 h-full flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:sticky md:top-8')}>
                {user && <ProfileCard user={user} />}
            </section>
            <section className={cn('w-full md:w-1/3 flex flex-col gap-4 mx-auto')}>
                {moments?.posts.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No posts yet</div>
                ) : (
                    moments?.posts.map(moment => (
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

export default ProfilePage
