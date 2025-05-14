import { cn } from "@/lib/utils"
import { FlipHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type CameraDisplayProps = {
    videoRef: React.RefObject<HTMLVideoElement>
    loading: boolean
    cameraPermission: boolean | null
    facingMode: "user" | "environment"
    toggleCamera: () => void
    previewMode: boolean
    capturedImage: string | null
}

export function CameraDisplay({
    videoRef,
    loading,
    cameraPermission,
    facingMode,
    toggleCamera,
    previewMode,
    capturedImage
}: CameraDisplayProps) {
    return (
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

            {/* Camera display or image preview */}
            {previewMode && capturedImage ? (
                <img
                    src={capturedImage}
                    alt="Preview"
                    className="h-full w-full object-contain bg-black"
                />
            ) : (
                <video
                    key={previewMode ? "preview" : "camera"}
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn("h-full w-full object-cover", (loading || cameraPermission === false) && "hidden")}
                />
            )}

            {/* Grid overlay - only show when not in preview mode */}
            {!previewMode && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="border border-white/20"></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Camera info - only show when not in preview mode */}
            {!previewMode && (
                <div className="absolute top-4 left-4 text-xs bg-black/50 p-2 border border-white">
                    <div>MODE: CAPTURE</div>
                    <div>RES: 1280x720</div>
                </div>
            )}

            {/* Camera controls - only show when not in preview mode */}
            {cameraPermission && !previewMode && (
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
    )
}