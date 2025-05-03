import axios from "axios";
import { CloudinaryAsset } from "./types";

const uploadImageToCloudinary = async (image: string) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "memento");

    const { data, status } = await axios.post<CloudinaryAsset>(
        "https://api.cloudinary.com/v1_1/metapass/image/upload",
        formData
    );

    if (!data || status != 200)
        throw new Error("Failed to upload to Cloudinary");
    return data.url;
};

function createDualCameraImage(
    backCanvas: HTMLCanvasElement,
    frontCanvas: HTMLCanvasElement
): string {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = backCanvas.width;
    finalCanvas.height = backCanvas.height;
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) throw new Error("Failed to create canvas context");

    ctx.drawImage(backCanvas, 0, 0);

    const insetSize = 0.25;
    const insetWidth = frontCanvas.width * insetSize;
    const insetHeight = frontCanvas.height * insetSize;
    const padding = Math.min(16, finalCanvas.width * 0.02);
    const insetX = finalCanvas.width - insetWidth - padding;
    const insetY = finalCanvas.height - insetHeight - padding;
    const radius = Math.min(12, insetWidth * 0.1);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(insetX + radius, insetY);
    ctx.lineTo(insetX + insetWidth - radius, insetY);
    ctx.arcTo(
        insetX + insetWidth,
        insetY,
        insetX + insetWidth,
        insetY + radius,
        radius
    );
    ctx.lineTo(insetX + insetWidth, insetY + insetHeight - radius);
    ctx.arcTo(
        insetX + insetWidth,
        insetY + insetHeight,
        insetX + insetWidth - radius,
        insetY + insetHeight,
        radius
    );
    ctx.lineTo(insetX + radius, insetY + insetHeight);
    ctx.arcTo(
        insetX,
        insetY + insetHeight,
        insetX,
        insetY + insetHeight - radius,
        radius
    );
    ctx.lineTo(insetX, insetY + radius);
    ctx.arcTo(insetX, insetY, insetX + radius, insetY, radius);
    ctx.closePath();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(frontCanvas, insetX, insetY, insetWidth, insetHeight);
    ctx.restore();

    return finalCanvas.toDataURL("image/jpeg", 0.9);
}

async function captureImages(
    videoRef: React.RefObject<HTMLVideoElement>,
    stream: MediaStream | null,
    facingMode: "user" | "environment",
    setLoading: (loading: boolean) => void,
    onCaptureComplete: (data: {
        frontImage: string;
        backImage: string;
        combinedImage: string;
    }) => void
) {
    if (!videoRef.current) return;

    setLoading(true);
    const originalFacingMode = facingMode;
    const targetFacingMode = facingMode === "user" ? "environment" : "user";
    let tempStream = null;

    const showStatusMessage = (message: string) => {
        const statusEl = document.createElement("div");
        statusEl.className =
            "fixed top-1/4 left-0 right-0 bg-black bg-opacity-70 text-white py-4 text-center text-xl font-bold z-50";
        statusEl.textContent = message;
        document.body.appendChild(statusEl);
        setTimeout(() => document.removeChild(statusEl), 3000)
        return statusEl;
    };

    const captureFromVideo = (
        video: HTMLVideoElement,
        isUserFacing: boolean
    ) => {
        const canvas = document.createElement("canvas");
        const width = video.videoWidth;
        const height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        if (isUserFacing) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0);
        return { canvas, dataUrl: canvas.toDataURL("image/jpeg", 0.9) };
    };

    try {
        const firstMessage = showStatusMessage(
            `CAPTURING ${originalFacingMode === "user" ? "FRONT" : "BACK"
            } CAMERA`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const firstCapture = captureFromVideo(
            videoRef.current,
            originalFacingMode === "user"
        );
        if (!firstCapture) throw new Error("Failed to capture first image");

        document.body.removeChild(firstMessage);
        stream?.getTracks().forEach((track) => track.stop());

        const switchingMessage = showStatusMessage("SWITCHING CAMERAS...");
        tempStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: targetFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 },
            },
        });

        if (videoRef.current) {
            videoRef.current.srcObject = tempStream;
            await new Promise((resolve) => {
                const loadHandler = () => {
                    videoRef.current?.removeEventListener(
                        "loadeddata",
                        loadHandler
                    );
                    resolve(null);
                };
                videoRef.current!.addEventListener("loadeddata", loadHandler);
                setTimeout(resolve, 1000);
            });

            document.body.removeChild(switchingMessage);
            const secondMessage = showStatusMessage(
                `CAPTURING ${targetFacingMode === "user" ? "FRONT" : "BACK"
                } CAMERA`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const secondCapture = captureFromVideo(
                videoRef.current,
                targetFacingMode === "user"
            );
            if (!secondCapture)
                throw new Error("Failed to capture second image");

            document.body.removeChild(secondMessage);
            const processingMessage = showStatusMessage(
                "CREATING DUAL CAMERA IMAGE..."
            );

            const backCanvas =
                originalFacingMode === "user"
                    ? secondCapture.canvas
                    : firstCapture.canvas;
            const frontCanvas =
                originalFacingMode === "user"
                    ? firstCapture.canvas
                    : secondCapture.canvas;
            const finalImage = createDualCameraImage(backCanvas, frontCanvas);

            document.body.removeChild(processingMessage);

            // Return the captured images
            onCaptureComplete({
                frontImage:
                    originalFacingMode === "user"
                        ? firstCapture.dataUrl
                        : secondCapture.dataUrl,
                backImage:
                    originalFacingMode === "user"
                        ? secondCapture.dataUrl
                        : firstCapture.dataUrl,
                combinedImage: finalImage,
            });
        }
    } catch (error) {
        console.error("momnt capture error:", error);
        const errorMessage = showStatusMessage("ERROR: CAPTURE FAILED");
        setTimeout(() => document.body.removeChild(errorMessage), 3000);
    } finally {
        tempStream?.getTracks().forEach((track) => track.stop());

        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: originalFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            return newStream;
        } catch (restoreError) {
            console.error("Failed to restore original camera:", restoreError);
        } finally {
            setLoading(false);
        }
    }
}

function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export { uploadImageToCloudinary, createDualCameraImage, captureImages, fileToDataURL };
