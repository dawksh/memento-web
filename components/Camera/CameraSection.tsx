"use client"

import { useCamera } from "@/hooks/useCamera"
import { StatusBar } from "./StatusBar"
import { CameraDisplay } from "./CameraDisplay"
import { CameraControls } from "./CameraControls"
import { uploadImageToCloudinary, captureImages } from "@/lib/imageHelper"
import { RefObject, useState, useEffect } from "react"
import axios from "axios"
import { Input } from "../ui/input"
import { useUser } from "@/hooks/useUser"

export default function CameraSection({ onClose, onForceClose }: { onClose?: () => void, onForceClose?: () => void }) {
    const {
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
        setDualCaptureData,
        cancelPreview,
        setLoading
    } = useCamera()

    const [uploading, setUploading] = useState(false)
    const [caption, setCaption] = useState("")

    const { data: user } = useUser()

    useEffect(() => {
        return () => {
            const video = videoRef.current
            const mediaStream = video?.srcObject as MediaStream | null
            mediaStream?.getTracks().forEach(track => track.stop())
            if (video) video.srcObject = null
        }
    }, [])

    const handleSnap = async () => {
        try {
            if (!videoRef.current) throw new Error('Video element not found')
            await captureImages(
                // @ts-expect-error type error
                videoRef,
                stream,
                facingMode,
                setLoading,
                data => {
                    setDualCaptureData({
                        frontImage: data.frontImage,
                        backImage: data.backImage,
                        combinedImage: data.combinedImage
                    })
                    setCapturedImage(data.combinedImage)
                    setPreviewMode(true)
                }
            )
        } catch (error) {
            console.error('Error capturing images:', error)
        }
    }

    const handleCancel = () => {
        cancelPreview()
        setLoading(false)
        if (onForceClose) onForceClose()
    }

    const handleConfirm = async () => {
        if (!capturedImage) return
        if (!user || !user?.walletAddress) return
        setLoading(true)
        setUploading(true)
        try {
            const url = await uploadImageToCloudinary(capturedImage)
            await axios.post('/api/moments', {
                title: caption,
                userAddress: user.walletAddress,
                imageUrl: url
            })
            setCaption("")
            if (onClose) onClose()
        } catch (error) {
            console.error('Error uploading image:', error)
        } finally {
            setUploading(false)
            cancelPreview()
            setLoading(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col font-mono text-white items-center overflow-hidden">
            {/* Top status bar */}
            {!previewMode && <StatusBar
                facingMode={facingMode}
                cameraPermission={cameraPermission}
            />}

            {/* Camera view or preview */}
            <CameraDisplay
                videoRef={videoRef as unknown as RefObject<HTMLVideoElement>}
                loading={loading || uploading}
                cameraPermission={cameraPermission}
                facingMode={facingMode}
                toggleCamera={toggleCamera}
                previewMode={previewMode}
                capturedImage={capturedImage}
            />

            {previewMode && <Input placeholder="add caption" className="text-black mt-2 w-3/4 text-center" onChange={e => setCaption(e.target.value)} />}

            {/* Control buttons */}
            <CameraControls
                loading={loading || uploading}
                cameraPermission={cameraPermission}
                previewMode={previewMode}
                onSnap={handleSnap}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    )
}