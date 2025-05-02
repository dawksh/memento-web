"use client"

import React from 'react'
import { Button } from '../ui/button'
import { usePrivy } from '@privy-io/react-auth'
import OpenCamera from '../Camera/OpenCamera'

const Navbar = () => {
    const { login, logout, authenticated, user } = usePrivy()
    return (
        <div className='flex flex-row justify-between items-center p-4'>
            <div className='italic font-semibold'>momnt</div>
            <OpenCamera label='post' />
            <div>
                {authenticated ? <><Button onClick={logout}>logout</Button></> : <Button className='hover:cursor-pointer' onClick={login}>login</Button>}
            </div>
        </div>
    )
}

export default Navbar