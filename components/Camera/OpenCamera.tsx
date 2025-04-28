import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import SnapCamera from "./SnapCamera"


const OpenCamera = ({ label, props }: { label: string, props?: any }) => {
    return (
        <div>
            <Dialog >
                <DialogTrigger><Button {...props} >{label}</Button></DialogTrigger>
                <DialogContent className="[&>button]:hidden">
                    <SnapCamera />
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default OpenCamera