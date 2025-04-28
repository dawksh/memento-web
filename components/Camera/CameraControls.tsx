import { Button } from "@/components/ui/button"

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
            <div className="grid grid-cols-2 border-t-4 border-white">
                <Button
                    className="py-6 text-xl bg-red-600 hover:bg-red-700 text-white font-bold rounded-none uppercase tracking-widest"
                    onClick={onCancel}
                >
                    CANCEL
                </Button>
                <Button
                    className="py-6 text-xl bg-green-600 hover:bg-green-700 text-white font-bold rounded-none uppercase tracking-widest"
                    onClick={onConfirm}
                >
                    CONFIRM
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 border-t-4 border-white">
            <Button
                className="py-8 text-2xl bg-white hover:bg-gray-300 text-black font-bold rounded-none uppercase tracking-widest"
                disabled={loading || cameraPermission === false}
                onClick={onSnap}
            >
                SNAP
            </Button>
        </div>
    )
}