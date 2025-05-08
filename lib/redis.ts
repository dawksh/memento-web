

import env from '@/config/env'
import { Redis } from '@upstash/redis'

export const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL || '',
    token: env.UPSTASH_REDIS_REST_TOKEN || ''
})


export const setUserNotificationDetails = async (fid: string, details: any) => {
    await redis.set(`user:${fid}`, JSON.stringify(details))
}

export const deleteUserNotificationDetails = async (fid: string) => {
    await redis.del(`user:${fid}`)
}