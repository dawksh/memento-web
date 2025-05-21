"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import { useMoments } from '@/hooks/useMoments'
import Post from '@/components/Feed/Post'

const Page = () => {
    const { address } = useParams()
    const { data: moments } = useMoments({ coin: address as string })
    return (
        <div className='flex flex-col gap-4 w-full md:w-1/3 mx-auto p-4'>
            {moments?.map((moment) => (
                <div key={moment.id}>
                    <Post
                        imageUrl={moment.assetURL}
                        caption={moment.caption}
                        timestamp={moment.createdAt}
                        user={moment.user}
                        coinAddress={moment.coinAddress}
                        rewards={moment.creatorRewards}
                    />
                </div>
            ))}
        </div>
    )
}

export default Page