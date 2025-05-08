import axios from "axios"

export const sendFrameNotification = async (url: string, tokens: string[], body: string, title: string) => {
    const { data } = await axios.post(url, JSON.stringify({
        notificationId: crypto.randomUUID(),
        title,
        body,
        targetUrl: "https://app.momnt.fun",
        tokens: tokens
    }))
    return data
}
