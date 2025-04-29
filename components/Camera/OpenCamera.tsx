import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import CameraSection from "./CameraSection"


const OpenCamera = ({ label, props }: { label: string, props?: any }) => {
    return (
        <div className="flex justify-center items-center">
            <Dialog >
                <DialogTrigger><Button {...props} >{label}</Button></DialogTrigger>
                <DialogContent className="[&>button]:hidden">
                    <CameraSection />
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default OpenCamera