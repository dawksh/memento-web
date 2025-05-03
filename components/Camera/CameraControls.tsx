import { Button } from "@/components/ui/button"
import { Camera, X, Check } from "lucide-react"

type CameraControlsProps = {
    loading: boolean
    cameraPermission: boolean | null
    previewMode: boolean
    onSnap: () => void
    onConfirm: () => void
    onCancel: () => void
}

export function CameraControls({
    loading,
    cameraPermission,
    previewMode,
    onSnap,
    onConfirm,
    onCancel
}: CameraControlsProps) {
    if (previewMode) {
        return (
            <div className="grid grid-cols-2 gap-px bg-gray-200 shadow-md m-2">
                <Button
                    className="flex items-center justify-center py-6 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-medium rounded-none transition-colors duration-200"
                    onClick={onCancel}
                >
                    <X className="mr-2 h-5 w-5" />
                    <span className="tracking-wide">CANCEL</span>
                </Button>
                <Button
                    className="flex items-center justify-center py-6 bg-white hover:bg-green-50 text-green-600 hover:text-green-700 font-medium rounded-none transition-colors duration-200"
                    onClick={onConfirm}
                >
                    <Check className="mr-2 h-5 w-5" />
                    <span className="tracking-wide">CONFIRM</span>
                </Button>
            </div>
        )
    }

    return (
        <div className="border-t border-gray-200 shadow-md m-2">
            <Button
                className="w-full flex items-center justify-center gap-2 py-8 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-none transition-colors duration-200"
                disabled={loading || cameraPermission === false}
                onClick={onSnap}
            >
                <Camera className="h-6 w-6" />
                <span className="tracking-wide">SNAP</span>
            </Button>
        </div>
    )
}