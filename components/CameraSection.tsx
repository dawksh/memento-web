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

        // Capture current camera view
        const captureCurrentCamera = () => {
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            if (!video) return null;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            // Flip if using front camera
            if (facingMode === "user") {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(video, 0, 0);
            return { canvas, dataUrl: canvas.toDataURL('image/jpeg') };
        };

        // Store the current camera image
        const currentCameraCapture = captureCurrentCamera();
        if (!currentCameraCapture) return;

        // Switch camera, wait for it to initialize, and capture second image
        const currentFacingMode = facingMode;
        const oppositeFacingMode = facingMode === "user" ? "environment" : "user";

        // Stop current stream to release camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        try {
            // Start opposite camera
            setLoading(true);
            const newConstraints = {
                video: {
                    facingMode: oppositeFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(newConstraints);

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;

                // Wait for video to be ready
                await new Promise(resolve => {
                    videoRef.current!.onloadeddata = resolve;
                });

                // Give a small delay for camera to properly adjust
                await new Promise(resolve => setTimeout(resolve, 300));

                // Capture opposite camera
                const oppositeCameraCapture = captureCurrentCamera();

                if (oppositeCameraCapture) {
                    // Determine which is front and which is back
                    let frontCapture, backCapture;

                    if (currentFacingMode === "user") {
                        frontCapture = currentCameraCapture;
                        backCapture = oppositeCameraCapture;
                    } else {
                        frontCapture = oppositeCameraCapture;
                        backCapture = currentCameraCapture;
                    }

                    // Create final composite image
                    const finalCanvas = document.createElement('canvas');
                    finalCanvas.width = backCapture.canvas.width;
                    finalCanvas.height = backCapture.canvas.height;
                    const finalCtx = finalCanvas.getContext('2d');

                    if (finalCtx) {
                        // Draw back camera image as background
                        finalCtx.drawImage(backCapture.canvas, 0, 0);

                        // Calculate dimensions for front camera inset (25% of original size)
                        const insetWidth = frontCapture.canvas.width * 0.25;
                        const insetHeight = frontCapture.canvas.height * 0.25;

                        // Position in bottom right with 16px padding
                        const insetX = finalCanvas.width - insetWidth - 16;
                        const insetY = finalCanvas.height - insetHeight - 16;

                        // Draw front camera image with a white border
                        finalCtx.lineWidth = 3;
                        finalCtx.strokeStyle = 'white';
                        finalCtx.fillStyle = 'black';

                        // Draw shadow/outline
                        finalCtx.fillRect(insetX - 2, insetY - 2, insetWidth + 4, insetHeight + 4);
                        finalCtx.strokeRect(insetX - 1, insetY - 1, insetWidth + 2, insetHeight + 2);

                        // Draw front camera image
                        finalCtx.drawImage(frontCapture.canvas, insetX, insetY, insetWidth, insetHeight);

                        // Generate final image and download
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const finalImage = finalCanvas.toDataURL('image/jpeg');

                        const link = document.createElement('a');
                        link.href = finalImage;
                        link.download = `bereal_${timestamp}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Save to localStorage if needed
                        localStorage.setItem('bereal_image', finalImage);
                    }
                }

                // Restore original camera
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                const originalConstraints = {
                    video: {
                        facingMode: currentFacingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    }
                };

                const originalStream = await navigator.mediaDevices.getUserMedia(originalConstraints);
                setStream(originalStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = originalStream;
                }
            }
        } catch (error) {
            console.error("Error during BeReal capture:", error);
        } finally {
            setFacingMode(currentFacingMode);
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
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="text-center">
                            <Loader2 className="h-16 w-16 animate-spin text-white mb-4" />
                            <div className="uppercase tracking-widest text-xs">LOADING CAMERA</div>
                        </div>
                    </div>
                )}

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
