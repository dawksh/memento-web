"use client"

import React from 'react'
import ProfileCard from '@/components/Feed/RightSection/ProfileCard'
import Post from '@/components/Feed/Post'
import { cn } from '@/lib/utils'

const mockUser = {
    id: '1',
    walletAddress: '0x1234567890abcdef',
    createdAt: '',
    updatedAt: '',
    name: 'Jane Doe',
    username: 'janedoe',
    profileImage: '',
    about: 'Web3 enthusiast. Love to share moments!'
}

const mockPosts = [
    {
        id: 'p1',
        title: 'First Post',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assetURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        createHash: null,
        userId: '1',
        coinAddress: '0xabcdefabcdefabcdef',
        caption: 'Enjoying the sunshine!',
        user: mockUser,
        creatorRewards: '0.01',
    },
    {
        id: 'p2',
        title: 'Second Post',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assetURL: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        createHash: null,
        userId: '1',
        coinAddress: '0xabcdefabcdefabcdef',
        caption: 'Another great day!',
        user: mockUser,
        creatorRewards: '0.02',
    },
]

const ProfilePage = () => (
    <div className={cn('flex flex-col md:flex-row w-full min-h-screen gap-4 p-4 bg-gray-50')}>
        <section className={cn('w-full md:w-2/5 flex-shrink-0 flex justify-center md:justify-start mb-4 md:mb-0')}>
            <ProfileCard user={mockUser} />
        </section>
        <section className={cn('w-full md:w-3/5 flex flex-col gap-4')}>
            {mockPosts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No posts yet</div>
            ) : (
                mockPosts.map(post => (
                    <Post
                        key={post.id}
                        imageUrl={post.assetURL}
                        caption={post.caption}
                        timestamp={post.createdAt}
                        user={post.user}
                        coinAddress={post.coinAddress}
                    />
                ))
            )}
        </section>
    </div>
)

export default ProfilePage