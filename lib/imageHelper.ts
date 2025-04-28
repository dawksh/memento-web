import axios from "axios";
import { CloudinaryAsset } from "./types";

const uploadImageToCloudinary = async (image: string) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'memento');


    const { data, status } = await axios.post<CloudinaryAsset>("https://api.cloudinary.com/v1_1/metapass/image/upload", formData)

    if (!data || status != 200) throw new Error("Failed to upload to Cloudinary");
    return data.url
}

export { uploadImageToCloudinary }
