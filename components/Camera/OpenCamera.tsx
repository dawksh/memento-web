import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CameraSection from "./CameraSection"
import { useState } from "react"
import { useHasPosted } from "@/hooks/useHasPosted"
import { cn } from "@/lib/utils"

const OpenCamera = ({ label, props }: { label: React.ReactNode, props?: any }) => {
    const [open, setOpen] = useState(false)
    const [cameraKey, setCameraKey] = useState(0)
    const { data: hasPosted } = useHasPosted()

    const handleClose = () => {
        setOpen(false)
        setCameraKey(k => k + 1)
    }
    return (
        <div className="flex justify-center items-center">
            <Dialog open={open} onOpenChange={v => {
                setOpen(v)
                if (!v) setCameraKey(k => k + 1)
            }}>
                <DialogTitle></DialogTitle>
                {hasPosted ? (
                    <div
                        {...props}
                        aria-disabled="true"
                        tabIndex={-1}
                        className={cn(
                            props?.className,
                            "opacity-50 pointer-events-none cursor-not-allowed"
                        )}
                    >
                        {label}
                    </div>
                ) : (
                    <DialogTrigger>
                        <div {...props}>{label}</div>
                    </DialogTrigger>
                )}
                <DialogContent className={cn("[&>button]:hidden")}>
                    <CameraSection key={cameraKey} onClose={() => setOpen(false)} onForceClose={handleClose} />
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default OpenCamera