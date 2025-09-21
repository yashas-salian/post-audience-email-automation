import { Context } from "hono";

export const uploadToCloudinary = async(c : Context, file : Blob) => {
    const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = c.env.CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(file.type)
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    return await fetch(cloudinaryUrl, { method: "POST", body });
} 