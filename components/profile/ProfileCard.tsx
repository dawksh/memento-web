import React from 'react'

type ProfileCardProps = {
    user: {
        profileImage?: string
        walletAddress: string
        name: string
        username: string
        about?: string
    }
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => (
    <div className="w-full flex flex-col items-center bg-white rounded-xl p-6 shadow gap-3">
        <img
            src={user.profileImage || `https://effigy.im/a/${user.walletAddress}.svg`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-200 mb-2"
        />
        <div className="text-lg font-semibold text-gray-900">{user.name}</div>
        <div className="text-gray-500 text-sm mb-2">@{user.username}</div>
        <div className="text-gray-700 text-center text-sm">
            {user.about || <span className="text-gray-400">No about info</span>}
        </div>
    </div>
)

export default ProfileCard 