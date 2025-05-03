import { useState, useEffect } from "react"

type StatusBarProps = {
    facingMode: "user" | "environment"
    cameraPermission: boolean | null
}

export function StatusBar({ facingMode, cameraPermission }: StatusBarProps) {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })

    return (
        <>
            {/* Top Status bar */}
            <div className="flex w-full justify-between items-center px-4 py-2 bg-white text-black border-b-4 border-white">
                <div className="text-xs uppercase tracking-widest">momnt</div>
                <div className="text-xs">{formattedTime}</div>
                <div className="text-xs uppercase">side: {facingMode === "user" ? "FRONT" : "BACK"}</div>
            </div>
        </>
    )
}