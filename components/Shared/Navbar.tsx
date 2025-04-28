"use client"

import React from 'react'
import { Button } from '../ui/button'
import { usePrivy } from '@privy-io/react-auth'
import { shortenAddress } from '@/lib/utils'

const Navbar = () => {
    const { login, authenticated, user } = usePrivy()
    return (
        <div className='flex flex-row justify-between p-4'>
            <div className='italic font-semibold'>memento</div>
            <div>
                {authenticated ? <>{shortenAddress(user?.wallet?.address!)}</> : <Button className='hover:cursor-pointer' onClick={login}>login</Button>}
            </div>
        </div>
    )
}

export default Navbar