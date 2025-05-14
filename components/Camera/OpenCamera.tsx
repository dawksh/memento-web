import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import CameraSection from "./CameraSection"
import { useState } from "react"


const OpenCamera = ({ label, props }: { label: React.ReactNode, props?: any }) => {
    const [open, setOpen] = useState(false)
    const [cameraKey, setCameraKey] = useState(0)
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
                <DialogTrigger><div {...props} >{label}</div></DialogTrigger>
                <DialogContent className="[&>button]:hidden">
                    <CameraSection key={cameraKey} onClose={() => setOpen(false)} onForceClose={handleClose} />
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default OpenCamera