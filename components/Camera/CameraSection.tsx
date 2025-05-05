"use client"

import { useCamera } from "@/hooks/useCamera"
import { StatusBar } from "./StatusBar"
import { CameraDisplay } from "./CameraDisplay"
import { CameraControls } from "./CameraControls"
import { uploadImageToCloudinary, captureImages } from "@/lib/imageHelper"
import { RefObject, useState } from "react"
import axios from "axios"
import { Input } from "../ui/input"
import { usePrivy } from "@privy-io/react-auth"
import { useUser } from "@/hooks/useUser"

export default function CameraSection() {
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

    const handleSnap = async () => {
        try {
            if (!videoRef.current) {
                throw new Error('Video element not found');
            }
            await captureImages(
                // @ts-expect-error type error
                videoRef,
                stream,
                facingMode,
                setLoading,
                (data) => {
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
            console.error("Error capturing images:", error)
        }
    }

    const handleConfirm = async () => {
        if (!capturedImage) return
        if (!user?.walletAddress) return
        setLoading(true)

        setUploading(true)
        try {
            const url = await uploadImageToCloudinary(capturedImage)
            await axios.post("/api/moments", {
                title: caption,
                userAddress: user.walletAddress,
                imageUrl: url
            })
        } catch (error) {
            console.error("Error uploading image:", error)
        } finally {
            setUploading(false)
            cancelPreview()
        }
        setLoading(false)
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
                onCancel={cancelPreview}
            />
        </div>
    )
}