import { useEffect, useRef, useState } from "react"

type FacingMode = "user" | "environment"

export function useCamera() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [loading, setLoading] = useState(true)
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
    const [facingMode, setFacingMode] = useState<FacingMode>("environment")
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [previewMode, setPreviewMode] = useState(false)
    const [dualCaptureData, setDualCaptureData] = useState<{
        frontImage: string | null;
        backImage: string | null;
        combinedImage: string | null;
    }>({
        frontImage: null,
        backImage: null,
        combinedImage: null
    })

    useEffect(() => {
        async function setupCamera() {
            try {
                setLoading(true)
                const constraints = {
                    video: {
                        facingMode,
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

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    }

    const cancelPreview = () => {
        setPreviewMode(false)
        setCapturedImage(null)
        setDualCaptureData({
            frontImage: null,
            backImage: null,
            combinedImage: null
        })
    }

    const captureFromVideo = (video: HTMLVideoElement, isUserFacing: boolean) => {
        const canvas = document.createElement('canvas')
        const width = video.videoWidth
        const height = video.videoHeight
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) return null

        if (isUserFacing) {
            ctx.translate(width, 0)
            ctx.scale(-1, 1)
        }

        ctx.drawImage(video, 0, 0)
        return { canvas, dataUrl: canvas.toDataURL('image/jpeg', 0.9) }
    }

    return {
        videoRef,
        stream,
        loading,
        cameraPermission,
        facingMode,
        toggleCamera,
        capturedImage,
        setCapturedImage,
        previewMode,
        setPreviewMode,
        dualCaptureData,
        setDualCaptureData,
        captureFromVideo,
        cancelPreview,
        setLoading
    }
}