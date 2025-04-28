"use client"

import { useEffect, useRef, useState } from "react"
import { FlipHorizontal, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CameraSection() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [loading, setLoading] = useState(true)
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        async function setupCamera() {
            try {
                setLoading(true)
                const constraints = {
                    video: {
                        facingMode: facingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                }

                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
                setStream(mediaStream)
                setCameraPermission(true)

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream
                }
            } catch (error) {
                console.error("Error accessing camera:", error)
                setCameraPermission(false)
            } finally {
                setLoading(false)
            }
        }

        setupCamera()

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [facingMode])

    const handleSnap = async () => {
        if (!videoRef.current) return;

        setLoading(true);
        const originalFacingMode = facingMode;
        const targetFacingMode = facingMode === "user" ? "environment" : "user";
        let tempStream = null;

        const showStatusMessage = (message: string) => {
            const statusEl = document.createElement('div');
            statusEl.className = 'fixed top-1/4 left-0 right-0 bg-black bg-opacity-70 text-white py-4 text-center text-xl font-bold z-50';
            statusEl.textContent = message;
            document.body.appendChild(statusEl);
            return statusEl;
        };

        const captureFromVideo = (video: HTMLVideoElement, isUserFacing: boolean) => {
            const canvas = document.createElement('canvas');
            const width = video.videoWidth;
            const height = video.videoHeight;
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            if (isUserFacing) {
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(video, 0, 0);
            return { canvas, dataUrl: canvas.toDataURL('image/jpeg', 0.9) };
        };

        try {
            const firstMessage = showStatusMessage(`CAPTURING ${originalFacingMode === "user" ? "FRONT" : "BACK"} CAMERA`);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const firstCapture = captureFromVideo(videoRef.current, originalFacingMode === "user");
            if (!firstCapture) throw new Error("Failed to capture first image");

            document.body.removeChild(firstMessage);
            stream?.getTracks().forEach(track => track.stop());

            const switchingMessage = showStatusMessage("SWITCHING CAMERAS...");
            tempStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: targetFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = tempStream;
                await new Promise(resolve => {
                    const loadHandler = () => {
                        videoRef.current?.removeEventListener('loadeddata', loadHandler);
                        resolve(null);
                    };
                    videoRef.current!.addEventListener('loadeddata', loadHandler);
                    setTimeout(resolve, 1000);
                });

                document.body.removeChild(switchingMessage);
                const secondMessage = showStatusMessage(`CAPTURING ${targetFacingMode === "user" ? "FRONT" : "BACK"} CAMERA`);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const secondCapture = captureFromVideo(videoRef.current, targetFacingMode === "user");
                if (!secondCapture) throw new Error("Failed to capture second image");

                document.body.removeChild(secondMessage);
                const processingMessage = showStatusMessage("CREATING DUAL CAMERA IMAGE...");

                const finalCanvas = document.createElement('canvas');
                const backCanvas = originalFacingMode === "user" ? secondCapture.canvas : firstCapture.canvas;
                const frontCanvas = originalFacingMode === "user" ? firstCapture.canvas : secondCapture.canvas;

                finalCanvas.width = backCanvas.width;
                finalCanvas.height = backCanvas.height;
                const ctx = finalCanvas.getContext('2d');
                if (!ctx) throw new Error("Failed to create canvas context");

                ctx.drawImage(backCanvas, 0, 0);

                const insetSize = 0.25;
                const insetWidth = frontCanvas.width * insetSize;
                const insetHeight = frontCanvas.height * insetSize;
                const padding = Math.min(16, finalCanvas.width * 0.02);
                const insetX = finalCanvas.width - insetWidth - padding;
                const insetY = finalCanvas.height - insetHeight - padding;
                const radius = Math.min(12, insetWidth * 0.1);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(insetX + radius, insetY);
                ctx.lineTo(insetX + insetWidth - radius, insetY);
                ctx.arcTo(insetX + insetWidth, insetY, insetX + insetWidth, insetY + radius, radius);
                ctx.lineTo(insetX + insetWidth, insetY + insetHeight - radius);
                ctx.arcTo(insetX + insetWidth, insetY + insetHeight, insetX + insetWidth - radius, insetY + insetHeight, radius);
                ctx.lineTo(insetX + radius, insetY + insetHeight);
                ctx.arcTo(insetX, insetY + insetHeight, insetX, insetY + insetHeight - radius, radius);
                ctx.lineTo(insetX, insetY + radius);
                ctx.arcTo(insetX, insetY, insetX + radius, insetY, radius);
                ctx.closePath();

                ctx.strokeStyle = 'white';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.clip();
                ctx.drawImage(frontCanvas, insetX, insetY, insetWidth, insetHeight);
                ctx.restore();

                document.body.removeChild(processingMessage);
                const savingMessage = showStatusMessage("SAVING IMAGE...");

                const timestamp = new Date().getTime();
                const finalImage = finalCanvas.toDataURL('image/jpeg', 0.9);

                const link = document.createElement('a');
                link.href = finalImage;
                link.download = `memento_${timestamp}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                document.body.removeChild(savingMessage);
                const successMessage = showStatusMessage("IMAGE SAVED!");
                setTimeout(() => document.body.removeChild(successMessage), 2000);
            }
        } catch (error) {
            console.error("Memento capture error:", error);
            const errorMessage = showStatusMessage("ERROR: CAPTURE FAILED");
            setTimeout(() => document.body.removeChild(errorMessage), 3000);
        } finally {
            tempStream?.getTracks().forEach(track => track.stop());

            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: originalFacingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    }
                });

                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
            } catch (restoreError) {
                console.error("Failed to restore original camera:", restoreError);
            }

            setFacingMode(originalFacingMode);
            setLoading(false);
        }
    };

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    }

    const formattedTime = currentTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })

    return (
        <main className="fixed inset-0 flex flex-col bg-black font-mono text-white overflow-hidden">
            {/* Status bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-white text-black border-b-4 border-white">
                <div className="text-xs uppercase tracking-widest">memento</div>
                <div className="text-xs">{formattedTime}</div>
                <div className="text-xs uppercase">{facingMode === "user" ? "FRONT" : "BACK"}</div>
            </div>

            {/* Camera view */}
            <div className="relative flex-1 w-full overflow-hidden border-x-4 border-white">

                {!loading && cameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-4 text-center">
                        <X className="h-24 w-24 text-white mb-4" />
                        <p className="text-white uppercase tracking-widest">CAMERA ACCESS DENIED</p>
                        <div className="mt-4 p-2 border-2 border-white">
                            <p className="text-white text-xs">ALLOW CAMERA ACCESS TO CONTINUE</p>
                        </div>
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn("h-full w-full object-cover", (loading || cameraPermission === false) && "hidden")}
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-white/20"></div>
                        ))}
                    </div>
                </div>

                {/* Camera info */}
                <div className="absolute top-4 left-4 text-xs bg-black/50 p-2 border border-white">
                    <div>MODE: CAPTURE</div>
                    <div>RES: 1280x720</div>
                </div>

                {/* Camera controls */}
                {cameraPermission && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-4 right-4 bg-black border-2 border-white hover:bg-white hover:text-black transition-none"
                        onClick={toggleCamera}
                    >
                        <FlipHorizontal className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Control bar */}
            <div className="grid grid-cols-1 border-t-4 border-white">
                <Button
                    className="py-8 text-2xl bg-white hover:bg-gray-300 text-black font-bold rounded-none uppercase tracking-widest"
                    disabled={loading || cameraPermission === false}
                    onClick={handleSnap}
                >
                    SNAP
                </Button>
            </div>

            {/* Status indicators */}
            <div className="flex justify-between items-center px-4 py-2 bg-white text-black text-xs uppercase tracking-widest">
                <div>{cameraPermission ? "CAMERA: ON" : "CAMERA: OFF"}</div>
            </div>
        </main>
    )
}
