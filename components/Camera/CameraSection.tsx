"use client"

import { useCamera } from "@/hooks/useCamera"
import { StatusBar } from "./StatusBar"
import { CameraDisplay } from "./CameraDisplay"
import { CameraControls } from "./CameraControls"
import { uploadImageToCloudinary, captureImages } from "@/lib/imageHelper"
import { RefObject, useState } from "react"

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
        dualCaptureData,
        setDualCaptureData,
        cancelPreview,
        setLoading
    } = useCamera()

    const [uploading, setUploading] = useState(false)

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

        setUploading(true)
        try {
            const url = await uploadImageToCloudinary(capturedImage)
            console.log("Image uploaded successfully:", url)
            // Here you can handle post-upload actions like showing a success message
            // or navigating to another screen
        } catch (error) {
            console.error("Error uploading image:", error)
        } finally {
            setUploading(false)
            cancelPreview()
        }
    }

    return (
        <div className="w-full h-full flex flex-col bg-black font-mono text-white overflow-hidden">
            {/* Top status bar */}
            <StatusBar
                facingMode={facingMode}
                cameraPermission={cameraPermission}
            />

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