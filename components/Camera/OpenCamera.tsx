import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import CameraSection from "./CameraSection"


const OpenCamera = ({ label, props }: { label: React.ReactNode, props?: any }) => {
    return (
        <div className="flex justify-center items-center">
            <Dialog>
                <DialogTrigger><div {...props} >{label}</div></DialogTrigger>
                <DialogContent className="[&>button]:hidden">
                    <CameraSection />
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default OpenCamera